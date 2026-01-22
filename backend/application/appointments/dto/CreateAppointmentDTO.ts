export class CreateAppointmentDTO {
  petId!: number;
  serviceId!: number;

  startTime!: string; // ISO
  endTime!: string; // ISO

  finalPrice?: number;
}
