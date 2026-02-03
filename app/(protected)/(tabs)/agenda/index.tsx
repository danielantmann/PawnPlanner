import { SafeAreaView, View } from 'react-native';
import { useMemo, useCallback } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-big-calendar';
import { useAgendaStore } from '@/src/modules/appointments/store/agenda.store';
import { useAppointments } from '@/src/modules/appointments/hooks/useAppointments';
import { CreateAppointmentModal } from '@/src/modules/appointments/components/Modals/CreateAppointmentModal';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { startOfMonth, endOfMonth } from 'date-fns';
import { colors } from '@/src/ui/theme/colors';
import { CustomCalendarHeader } from '@/src/modules/appointments/components/CustomCalendarHeader';
import { SpeedDialDialog } from '@/src/ui/components/primitives/SpeedDialDialog';

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

  const events = useMemo(
    () =>
      (appointments ?? []).map((apt: any) => ({
        id: apt.id.toString(),
        title: `${apt.petName} - ${apt.serviceName}`,
        start: new Date(apt.startTime),
        end: new Date(apt.endTime),
        color:
          apt.status === 'completed'
            ? colors.success
            : apt.status === 'no-show'
              ? colors.danger
              : colors.primary,
      })),
    [appointments]
  );

  const handleDateChange = useCallback(
    (dates: any) => {
      if (!dates) return;
      const newDate = Array.isArray(dates) ? dates[0] : dates;
      if (newDate.getTime() !== selectedDate.getTime()) {
        setSelectedDate(newDate);
      }
    },
    [selectedDate, setSelectedDate]
  );

  const handlePressEvent = useCallback((event: any) => {
    console.log('Event pressed:', event);
  }, []);

  const handlePressCell = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      openCreateModal();
    },
    [setSelectedDate, openCreateModal]
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      {/* Header */}
      <View className="px-4 pb-2 pt-4">
        <ScreenHeader title="Agenda" subtitle="Gestiona tus citas" />
      </View>

      {/* Calendar */}
      <View className="relative flex-1">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Calendar
            events={events}
            height={800}
            mode={viewMode}
            date={selectedDate}
            onChangeDate={handleDateChange}
            onPressEvent={handlePressEvent}
            onPressCell={handlePressCell}
            minHour={8}
            maxHour={22}
            showTime
            hourRowHeight={50}
            eventCellStyle={(event: any) => ({
              backgroundColor: event.color,
              borderRadius: 6,
              padding: 4,
            })}
            eventCellTextColor={colors.background}
            scrollOffsetMinutes={480}
            ampm={false}
            locale="es"
            renderHeader={() => (
              <CustomCalendarHeader
                date={selectedDate}
                mode={viewMode}
                onDateChange={setSelectedDate}
                onModeChange={setViewMode}
              />
            )}
            renderHeaderForMonthView={() => (
              <CustomCalendarHeader
                date={selectedDate}
                mode={viewMode}
                onDateChange={setSelectedDate}
                onModeChange={setViewMode}
              />
            )}
          />
        </GestureHandlerRootView>

        {/* SpeedDial estilo macOS */}
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
                  setViewMode('day');
                  setSelectedDate(new Date());
                },
              },
            ]}
          />
        </View>
      </View>

      {/* Create Appointment Modal */}
      <CreateAppointmentModal
        visible={createModalVisible}
        onClose={closeCreateModal}
        selectedDate={selectedDate}
      />
    </SafeAreaView>
  );
}
