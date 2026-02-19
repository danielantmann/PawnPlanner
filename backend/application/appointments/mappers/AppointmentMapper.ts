import { Appointment } from '../../../core/appointments/domain/Appointment';
import { AppointmentResponseDTO } from '../dto/AppointmentResponseDTO';

export class AppointmentMapper {
  static toDTO(appointment: Appointment): AppointmentResponseDTO {
    return {
      id: appointment.id!,

      petId: appointment.petId,
      petName: appointment.petName,

      ownerName: appointment.ownerName,
      ownerPhone: appointment.ownerPhone,

      serviceId: appointment.serviceId,
      serviceName: appointment.serviceName,

      workerId: appointment.workerId ?? null,
      workerName: appointment.workerName ?? null,

      estimatedPrice: appointment.estimatedPrice,
      finalPrice: appointment.finalPrice,

      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      durationMinutes: appointment.durationMinutes,

      status: appointment.status,
    };
  }
}
