import { SafeAreaView, View } from 'react-native';
import { useMemo, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-big-calendar';
import { useAgendaStore } from '@/src/modules/appointments/store/agenda.store';
import { useAppointments } from '@/src/modules/appointments/hooks/useAppointments';
import { CreateAppointmentModal } from '@/src/modules/appointments/components/Modals/CreateAppointmentModal';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { startOfMonth, endOfMonth, startOfWeek } from 'date-fns';
import { CustomCalendarHeader } from '@/src/modules/appointments/components/CustomCalendarHeader';
import { SpeedDialDialog } from '@/src/ui/components/primitives/SpeedDialDialog';

import { CalendarEvent } from '@/src/modules/appointments/types/calendar-event.types';
import { EventCard } from '@/src/modules/appointments/components/EventCard/EventCard';
import { MonthSummaryCard } from '@/src/modules/appointments/components/EventCard/MonthSummaryCard';

export default function AgendaScreenBigCalendar() {
  const {
    viewMode,
    selectedDate,
    createModalVisible,
    setSelectedDate,
    setViewMode,
    closeCreateModal,
    openCreateModal,
  } = useAgendaStore();

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const { data: appointments } = useAppointments({
    start: monthStart.toISOString(),
    end: monthEnd.toISOString(),
  });

  const events = useMemo<CalendarEvent[]>(
    () =>
      (appointments ?? []).map((apt) => ({
        id: apt.id.toString(),
        title: apt.petName,
        petName: apt.petName,
        serviceName: apt.serviceName,
        start: new Date(apt.startTime),
        end: new Date(apt.endTime),
        status: apt.status,
      })),
    [appointments]
  );

  // ⭐ Cambiar modo según comportamiento deseado
  const handleModeChange = useCallback(
    (mode: 'day' | '3days' | 'week' | 'month') => {
      setViewMode(mode);

      if (mode === 'day' || mode === '3days') {
        setSelectedDate(new Date());
      } else if (mode === 'week') {
        setSelectedDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      }
      // Mes → no tocamos la fecha
    },
    [setViewMode, setSelectedDate]
  );

  // ⭐ Solo actualizamos fecha cuando tiene sentido
  const handleDateChange = useCallback(
    (dates: any) => {
      if (!dates) return;
      const newDate = Array.isArray(dates) ? dates[0] : dates;

      // Día → swipe cambia fecha
      if (viewMode === 'day') {
        setSelectedDate(newDate);
      }

      // Mes → swipe cambia mes
      if (viewMode === 'month') {
        setSelectedDate(newDate);
      }
    },
    [viewMode, setSelectedDate]
  );

  const handlePressEvent = useCallback((event: CalendarEvent) => {}, []);

  const handlePressCell = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      openCreateModal();
    },
    [setSelectedDate, openCreateModal]
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      {/* Header superior */}
      <View className="px-4 pb-2 pt-4">
        <ScreenHeader title="Agenda" subtitle="Gestiona tus citas" />
      </View>

      {/* Custom Header */}
      <CustomCalendarHeader
        date={selectedDate}
        mode={viewMode}
        onDateChange={setSelectedDate}
        onModeChange={handleModeChange}
      />

      {/* Calendario */}
      <View className="relative flex-1 bg-white">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Calendar<CalendarEvent>
            events={events}
            height={600}
            mode={viewMode}
            date={selectedDate}
            onChangeDate={handleDateChange}
            onPressEvent={handlePressEvent}
            onPressCell={handlePressCell}
            minHour={8}
            maxHour={22}
            showTime
            hourRowHeight={60}
            scrollOffsetMinutes={480}
            ampm={false}
            locale="es"
            weekStartsOn={1}
            maxVisibleEventCount={viewMode === 'month' ? 1 : 3}
            moreLabel=""
            theme={{
              palette: {
                primary: { main: '#4F46E5', contrastText: '#fff' },
                nowIndicator: '#4F46E5',
                gray: {
                  '100': '#FFFFFF',
                  '200': '#F3F4F6',
                  '300': '#E5E7EB',
                  '500': '#6B7280',
                  '800': '#111827',
                },
              },
            }}
            headerContainerStyle={{
              backgroundColor: '#FFFFFF',
              height: 70,
            }}
            eventCellStyle={() => ({
              backgroundColor: 'transparent',
              borderWidth: 0,
              borderRadius: 0,
              padding: 0,
              margin: 0,
              elevation: 0,
              shadowOpacity: 0,
              shadowColor: 'transparent',
              shadowRadius: 0,
              shadowOffset: { width: 0, height: 0 },
            })}
            renderEvent={(event, touchableOpacityProps) => {
              if (viewMode === 'month') {
                // En modo mes, renderizar la card de resumen
                const dayEvents = events.filter(
                  (e) =>
                    e.start.toDateString() === event.start.toDateString() ||
                    e.end.toDateString() === event.start.toDateString()
                );

                // Solo renderizar una vez por día (primer evento)
                if (event.id === dayEvents[0]?.id) {
                  return (
                    <View style={{ width: '100%', alignItems: 'center', paddingTop: 4 }}>
                      <MonthSummaryCard
                        count={dayEvents.length}
                        onPress={() => {
                          setSelectedDate(event.start);
                          setViewMode('day');
                        }}
                      />
                    </View>
                  );
                }
                return null;
              }

              // Otros modos
              const { key, style, ...rest } = touchableOpacityProps;
              return (
                <View key={key} {...rest} style={[style, { backgroundColor: 'transparent' }]}>
                  <EventCard event={event} mode={viewMode} />
                </View>
              );
            }}
          />
        </GestureHandlerRootView>

        {/* Speed Dial */}
        <View className="absolute bottom-6 right-4 z-50">
          <SpeedDialDialog
            actions={[
              {
                id: 'create',
                label: 'Nueva cita',
                icon: 'add',
                onPress: openCreateModal,
              },
              {
                id: 'today',
                label: 'Ir a hoy',
                icon: 'event',
                onPress: () => {
                  handleModeChange('day');
                },
              },
            ]}
          />
        </View>
      </View>

      {/* Modal */}
      <CreateAppointmentModal
        visible={createModalVisible}
        onClose={closeCreateModal}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
}
