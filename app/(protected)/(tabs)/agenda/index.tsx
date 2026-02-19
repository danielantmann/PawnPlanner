import { SafeAreaView, View } from 'react-native';
import { useMemo, useCallback, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-big-calendar';
import { useAgendaStore } from '@/src/modules/appointments/store/agenda.store';
import { useAppointments } from '@/src/modules/appointments/hooks/useAppointments';
import { AppointmentFormModal } from '@/src/modules/appointments/components/Modals/AppointmentFormModal';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { startOfMonth, endOfMonth, startOfWeek } from 'date-fns';
import { CustomCalendarHeader } from '@/src/modules/appointments/components/CustomCalendarHeader';
import { SpeedDialDialog } from '@/src/ui/components/primitives/SpeedDialDialog';

import type { CalendarEvent } from '@/src/modules/appointments/types/calendar-event.types';
import type { AppointmentDTO } from '@/src/modules/appointments/types/appointment.types';
import { EventCard } from '@/src/modules/appointments/components/EventCard/EventCard';
import { MonthSummaryCard } from '@/src/modules/appointments/components/EventCard/MonthSummaryCard';

import { useTranslation } from 'react-i18next';

export default function AgendaScreenBigCalendar() {
  const { t } = useTranslation();

  const {
    viewMode,
    selectedDate,
    createModalVisible,
    setSelectedDate,
    setViewMode,
    closeCreateModal,
    openCreateModal,
    setSelectedHour,
    setSelectedMinute,
  } = useAgendaStore();

  const [editingAppointment, setEditingAppointment] = useState<AppointmentDTO | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

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
        appointmentData: apt,
      })),
    [appointments]
  );

  const handleModeChange = useCallback(
    (mode: 'day' | '3days' | 'week' | 'month') => {
      setViewMode(mode);

      if (mode === 'day' || mode === '3days') {
        setSelectedDate(new Date());
      } else if (mode === 'week') {
        setSelectedDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      }
    },
    [setViewMode, setSelectedDate]
  );

  const handleDateChange = useCallback(
    (dates: any) => {
      if (!dates) return;
      const newDate = Array.isArray(dates) ? dates[0] : dates;

      if (viewMode === 'day' || viewMode === 'month') {
        setSelectedDate(newDate);
      }
    },
    [viewMode, setSelectedDate]
  );

  const handlePressEvent = useCallback((event: CalendarEvent) => {
    if (!event.appointmentData) return;

    setEditingAppointment(event.appointmentData);
    setIsEditMode(true);
    setEditModalVisible(true);
  }, []);

  const handlePressCell = useCallback(
    (date: Date) => {
      setSelectedDate(date);

      const hour = date.getHours();
      const minute = date.getMinutes();

      setSelectedHour(hour);
      setSelectedMinute(minute);

      setEditingAppointment(null);
      setIsEditMode(false);
      openCreateModal();
    },
    [setSelectedDate, setSelectedHour, setSelectedMinute, openCreateModal]
  );

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEditingAppointment(null);
    setIsEditMode(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <View className="px-4 pb-2 pt-4">
        <ScreenHeader
          title={t('appointments.agenda.title')}
          subtitle={t('appointments.agenda.subtitle')}
        />
      </View>

      <CustomCalendarHeader
        date={selectedDate}
        mode={viewMode}
        onDateChange={setSelectedDate}
        onModeChange={handleModeChange}
      />

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
            overlapOffset={70}
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
                const dayEvents = events.filter(
                  (e) =>
                    e.start.toDateString() === event.start.toDateString() ||
                    e.end.toDateString() === event.start.toDateString()
                );

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

              const eventDurationMinutes = Math.round(
                (event.end.getTime() - event.start.getTime()) / (1000 * 60)
              );

              const isCompressed = eventDurationMinutes < 30;

              const { key, style, ...rest } = touchableOpacityProps;
              return (
                <View key={key} {...rest} style={[style, { backgroundColor: 'transparent' }]}>
                  <EventCard
                    event={event}
                    mode={viewMode}
                    onPress={handlePressEvent}
                    isCompressed={isCompressed}
                  />
                </View>
              );
            }}
          />
        </GestureHandlerRootView>

        <View className="absolute bottom-6 right-4 z-50">
          <SpeedDialDialog
            actions={[
              {
                id: 'create',
                label: t('appointments.speedDial.newAppointment'),
                icon: 'add',
                onPress: openCreateModal,
              },
              {
                id: 'today',
                label: t('appointments.speedDial.goToday'),
                icon: 'calendarToday',
                onPress: () => {
                  handleModeChange('day');
                },
              },
            ]}
          />
        </View>
      </View>

      <AppointmentFormModal visible={createModalVisible} onClose={closeCreateModal} />

      <AppointmentFormModal
        visible={editModalVisible}
        onClose={handleCloseEditModal}
        appointment={editingAppointment}
        isEditMode={isEditMode}
      />
    </SafeAreaView>
  );
}
