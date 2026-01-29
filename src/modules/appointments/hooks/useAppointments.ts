import { useState, useCallback } from 'react';
import { getAppointments } from '../api/appointments.api';
import type { AppointmentDTO } from '../types/appointment.types';

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (start: string, end: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAppointments({ start, end });
      setAppointments(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
  };
}
