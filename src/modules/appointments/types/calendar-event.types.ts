import { ICalendarEventBase } from 'react-native-big-calendar';
import { AppointmentStatus } from './appointment.types';

export interface CalendarEvent extends ICalendarEventBase {
  id: string;
  title: string; // requerido por el calendario
  petName: string;
  serviceName: string;
  status: AppointmentStatus;
}
