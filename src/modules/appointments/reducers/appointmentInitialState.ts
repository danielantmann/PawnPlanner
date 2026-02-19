import type { AppointmentFormState } from '../types/appointment.types';

export const appointmentInitialState: AppointmentFormState = {
  petId: '',
  serviceId: '',
  workerId: '',
  startTime: '09:00',
  endTime: '10:00',
  finalPrice: '',
  status: 'completed',
};
