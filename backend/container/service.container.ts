import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { ServiceRepository } from '../infrastructure/repositories/ServiceRepository';
import { IServiceRepository } from '../core/services/domain/IServiceRepository';

export function setupServiceContainer(dataSource: DataSource): void {
  container.register<IServiceRepository>('ServiceRepository', {
    useFactory: () => new ServiceRepository(dataSource),
  });
}
