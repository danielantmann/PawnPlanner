import { ICalendarEventBase } from 'react-native-big-calendar';
import type { AppointmentStatus, AppointmentDTO } from './appointment.types';

export interface CalendarEvent extends ICalendarEventBase {
  id: string;
  title: string; // requerido por el calendario
  petName: string;
  serviceName: string;
  status: AppointmentStatus;
  // ⭐ Datos completos de la cita para edición
  appointmentData?: AppointmentDTO;
}
