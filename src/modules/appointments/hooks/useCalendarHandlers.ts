import { useCallback } from 'react';
import { startOfWeek } from 'date-fns';
import type { CalendarEvent } from '../types/calendar-event.types';
import type { AppointmentDTO } from '../types/appointment.types';

export function useCalendarHandlers({
  viewMode,
  setViewMode,
  setSelectedDate,
  setSelectedHour,
  setSelectedMinute,
  openCreateModal,
  setEditingAppointment,
  setIsEditMode,
  setEditModalVisible,
}: any) {
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

      setSelectedHour(date.getHours());
      setSelectedMinute(date.getMinutes());

      setEditingAppointment(null);
      setIsEditMode(false);
      openCreateModal();
    },
    [setSelectedDate, setSelectedHour, setSelectedMinute, openCreateModal]
  );

  return {
    handleModeChange,
    handleDateChange,
    handlePressEvent,
    handlePressCell,
  };
}
