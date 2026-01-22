import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AppointmentRepository } from '../infrastructure/repositories/AppointmentRepository';
import { IAppointmentRepository } from '../core/appointments/domain/IAppointmentRepository';
import { CreateAppointmentService } from '../application/appointments/services/CreateAppointmentService';
import { UpdateAppointmentService } from '../application/appointments/services/UpdateAppointmentService';
import { DeleteAppointmentService } from '../application/appointments/services/DeleteAppointmentService';
import { GetAppointmentsByRangeService } from '../application/appointments/services/GetAppointmentsByRangeService';
import { GetCompletedAppointmentsInRangeService } from '../application/appointments/services/GetCompletedAppointmentsInRangeService';

export function setupAppointmentContainer(dataSource: DataSource): void {
  container.register<IAppointmentRepository>('AppointmentRepository', {
    useFactory: () => new AppointmentRepository(dataSource),
  });

  container.register(CreateAppointmentService, { useClass: CreateAppointmentService });
  container.register(UpdateAppointmentService, { useClass: UpdateAppointmentService });
  container.register(DeleteAppointmentService, { useClass: DeleteAppointmentService });
  container.register(GetAppointmentsByRangeService, { useClass: GetAppointmentsByRangeService });
  container.register(GetCompletedAppointmentsInRangeService, {
    useClass: GetCompletedAppointmentsInRangeService,
  });
}
