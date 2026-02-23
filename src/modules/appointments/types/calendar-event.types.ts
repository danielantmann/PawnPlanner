import { ICalendarEventBase } from 'react-native-big-calendar';
import type { AppointmentStatus, AppointmentDTO } from './appointment.types';

export interface CalendarEvent extends ICalendarEventBase {
  id: string;
  title: string;
  petName: string;
  serviceName: string;
  workerName?: string | null;
  status: AppointmentStatus;
  appointmentData?: AppointmentDTO;
  overlappingCount?: number;
  count?: number;
}
