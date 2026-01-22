import { injectable, inject } from 'tsyringe';

import { IAppointmentRepository } from '../../../core/appointments/domain/IAppointmentRepository';
import { AppointmentMapper } from '../mappers/AppointmentMapper';
import { BadRequestError } from '../../../shared/errors/BadRequestError';

@injectable()
export class GetAppointmentsByRangeService {
  constructor(@inject('AppointmentRepository') private appointments: IAppointmentRepository) {}

  async execute(start: string, end: string, userId: number) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestError('Invalid date format');
    }

    if (startDate > endDate) {
      throw new BadRequestError('start must be before end');
    }

    const results = await this.appointments.findByDateRange(userId, startDate, endDate);
    return results.map((a) => AppointmentMapper.toDTO(a));
  }
}
