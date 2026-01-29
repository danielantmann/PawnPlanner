import { api } from '../../../lib/axios';
import type { AppointmentDTO } from '../types/appointment.types';

interface GetAppointmentsParams {
  start: string; // ISO string
  end: string; // ISO string
}

/**
 * Fetch appointments within a date range
 * GET /appointments?start=...&end=...
 */
export async function getAppointments({ start, end }: GetAppointmentsParams) {
  const response = await api.get<AppointmentDTO[]>('/appointments', {
    params: { start, end },
  });

  return response.data;
}

/**
 * Fetch completed appointments within a date range
 * GET /appointments/completed?start=...&end=...
 */
export async function getCompletedAppointments({ start, end }: GetAppointmentsParams) {
  const response = await api.get<AppointmentDTO[]>('/appointments/completed', {
    params: { start, end },
  });

  return response.data;
}
