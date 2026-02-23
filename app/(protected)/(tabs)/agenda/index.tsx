import React, { useState } from 'react';
import { SafeAreaView, View, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-big-calendar';
import { useAgendaStore } from '@/src/modules/appointments/store/agenda.store';
import { useAppointments } from '@/src/modules/appointments/hooks/useAppointments';
import { AppointmentFormModal } from '@/src/modules/appointments/components/Modals/AppointmentFormModal';
import { ScreenHeader } from '@/src/ui/components/patterns/ScreenHeader';
import { startOfMonth, endOfMonth } from 'date-fns';
import { CustomCalendarHeader } from '@/src/modules/appointments/components/CustomCalendarHeader';
import { SpeedDialDialog } from '@/src/ui/components/primitives/SpeedDialDialog';

import { useCalendarEvents } from '@/src/modules/appointments/hooks/useCalendarEvents';
import { useCalendarHandlers } from '@/src/modules/appointments/hooks/useCalendarHandlers';
import { renderMonthEvent } from '@/src/modules/appointments/components/Calendar/renderMonthEvent';
import { renderOtherEvent } from '@/src/modules/appointments/components/Calendar/renderOtherEvent';

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

  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const { data: appointments } = useAppointments({
    start: monthStart.toISOString(),
    end: monthEnd.toISOString(),
  });

  const events = useCalendarEvents(appointments, viewMode);

  const { handleModeChange, handleDateChange, handlePressEvent, handlePressCell } =
    useCalendarHandlers({
      viewMode,
      setViewMode,
      setSelectedDate,
      setSelectedHour,
      setSelectedMinute,
      openCreateModal,
      setEditingAppointment,
      setIsEditMode,
      setEditModalVisible,
    });

  const monthRenderer = renderMonthEvent(events, setSelectedDate, setViewMode);
  const otherRenderer = renderOtherEvent({
    viewMode,
    events,
    handlePressEvent,
    setSelectedDate,
    setViewMode,
  });

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
          {viewMode === 'month' ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}>
              <Calendar
                events={events}
                height={500}
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
                maxVisibleEventCount={1}
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
                renderEvent={monthRenderer}
              />
            </ScrollView>
          ) : (
            <Calendar
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
              maxVisibleEventCount={3}
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
              renderEvent={otherRenderer}
            />
          )}
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
                onPress: () => handleModeChange('day'),
              },
            ]}
          />
        </View>
      </View>

      <AppointmentFormModal visible={createModalVisible} onClose={closeCreateModal} />

      <AppointmentFormModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setEditingAppointment(null);
          setIsEditMode(false);
        }}
        appointment={editingAppointment}
        isEditMode={isEditMode}
      />
    </SafeAreaView>
  );
}
