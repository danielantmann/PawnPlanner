export interface AppointmentDTO {
  id: number;

  userId: number;
  petId: number;
  ownerId: number;
  serviceId: number;

  petName: string;
  ownerName: string;
  ownerPhone: string;

  serviceName: string;

  estimatedPrice: number;
  finalPrice: number;

  startTime: string;
  endTime: string;
  durationMinutes: number;

  status: 'completed' | 'no-show' | 'cancelled';
}
