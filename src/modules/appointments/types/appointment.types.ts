export type AppointmentStatus = 'completed' | 'no-show' | 'cancelled';

export interface AppointmentDTO {
  id: number;
  petId: number;
  serviceId: number;
  petName: string;
  ownerName: string;
  ownerPhone: string;
  serviceName: string;
  workerId?: number | null;
  workerName?: string | null;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  estimatedPrice: number;
  finalPrice?: number;
}

export interface CreateAppointmentPayload {
  petId: number;
  serviceId: number;
  startTime: string;
  endTime: string;
  finalPrice?: number;
  workerId?: number;
}

export interface UpdateAppointmentPayload {
  petId?: number;
  serviceId?: number;
  startTime?: string;
  endTime?: string;
  finalPrice?: number;
  status?: AppointmentStatus;
  workerId?: number;
}

export interface AppointmentFormState {
  petId: string;
  serviceId: string;
  workerId: string;
  startTime: string;
  endTime: string;
  finalPrice: string;
  status: AppointmentStatus;
}

export type AppointmentFormAction =
  | { type: 'SET_FIELD'; field: keyof AppointmentFormState; value: string }
  | { type: 'RESET' }
  | { type: 'SET_STATE'; state: AppointmentFormState };
