import { container } from 'tsyringe';
import { DataSource } from 'typeorm';

import { IServiceRepository } from '../core/services/domain/IServiceRepository';
import { ServiceRepository } from '../infrastructure/repositories/ServiceRepository';

import { CreateServiceService } from '../application/services/services/CreateServiceService';
import { GetAllServicesService } from '../application/services/services/GetAllServicesService';
import { GetServiceByIdService } from '../application/services/services/GetServiceByIdService';
import { UpdateServiceService } from '../application/services/services/UpdateServiceService';
import { DeleteServiceService } from '../application/services/services/DeleteServiceService';

export function setupServiceContainer(dataSource: DataSource): void {
  // Repositorio
  container.register<IServiceRepository>('ServiceRepository', {
    useFactory: () => new ServiceRepository(dataSource),
  });

  // Casos de uso
  container.register(CreateServiceService, { useClass: CreateServiceService });
  container.register(GetAllServicesService, { useClass: GetAllServicesService });
  container.register(GetServiceByIdService, { useClass: GetServiceByIdService });
  container.register(UpdateServiceService, { useClass: UpdateServiceService });
  container.register(DeleteServiceService, { useClass: DeleteServiceService });
}
