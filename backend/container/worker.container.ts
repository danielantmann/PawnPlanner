import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { WorkerRepository } from '../infrastructure/repositories/WorkerRepository';
import { IWorkerRepository } from '../core/workers/domain/IWorkerRepository';
import { CreateWorkerService } from '../application/workers/services/CreateWorkerService';
import { GetAllWorkersService } from '../application/workers/services/GetAllWorkersService';
import { GetWorkerByIdService } from '../application/workers/services/GetWorkerByIdService';
import { UpdateWorkerService } from '../application/workers/services/UpdateWorkerService';
import { DeleteWorkerService } from '../application/workers/services/DeleteWorkerService';

export function setupWorkerContainer(dataSource: DataSource): void {
  // Repositorio
  container.register<IWorkerRepository>('WorkerRepository', {
    useFactory: () => new WorkerRepository(dataSource),
  });

  // Casos de uso
  container.register(CreateWorkerService, { useClass: CreateWorkerService });
  container.register(GetAllWorkersService, { useClass: GetAllWorkersService });
  container.register(GetWorkerByIdService, { useClass: GetWorkerByIdService });
  container.register(UpdateWorkerService, { useClass: UpdateWorkerService });
  container.register(DeleteWorkerService, { useClass: DeleteWorkerService });
}
