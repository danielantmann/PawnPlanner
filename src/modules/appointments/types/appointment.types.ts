// src/modules/appointments/types/appointment.types.ts

export type AppointmentStatus = 'completed' | 'no-show' | 'cancelled';

export interface AppointmentDTO {
  id: number;
  petId: number;
  serviceId: number;
  petName: string;
  ownerName: string;
  ownerPhone: string;
  serviceName: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: AppointmentStatus;
  finalPrice?: number;
}

export interface CreateAppointmentPayload {
  petId: number;
  serviceId: number;
  startTime: string; // ISO string
  endTime: string; // ISO string
  finalPrice?: number;
}

export interface UpdateAppointmentPayload {
  petId?: number;
  serviceId?: number;
  startTime?: string;
  endTime?: string;
  finalPrice?: number;
  status?: AppointmentStatus;
}

export interface AppointmentFormData {
  petId: number;
  serviceId: number;
  date: Date;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  finalPrice?: number;
  status?: AppointmentStatus;
}
