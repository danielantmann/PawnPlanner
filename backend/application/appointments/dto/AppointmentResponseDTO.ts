export class AppointmentResponseDTO {
  id!: number;

  petId!: number;
  petName!: string;

  ownerName!: string;
  ownerPhone!: string;

  serviceId!: number;
  serviceName!: string;

  workerId: number | null = null;
  workerName: string | null = null;

  estimatedPrice!: number;
  finalPrice!: number;

  startTime!: string;
  endTime!: string;
  durationMinutes!: number;

  status!: string;
}
