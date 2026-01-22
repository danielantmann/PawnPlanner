import { injectable, inject } from 'tsyringe';
import { IAppointmentRepository } from '../../../core/appointments/domain/IAppointmentRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

@injectable()
export class DeleteAppointmentService {
  constructor(@inject('AppointmentRepository') private appointments: IAppointmentRepository) {}

  async execute(id: number, userId: number): Promise<void> {
    const existing = await this.appointments.findById(id, userId);
    if (!existing) {
      throw new NotFoundError(`Appointment with id ${id} not found`);
    }

    await this.appointments.delete(id, userId);
  }
}
