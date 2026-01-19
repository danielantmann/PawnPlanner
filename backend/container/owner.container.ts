import { container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { OwnerRepository } from '../infrastructure/repositories/OwnerRepository';
import { IOwnerRepository } from '../core/owners/domain/IOwnerRepository';
import { CreateOwnerService } from '../application/owners/services/CreateOwnerService';
import { UpdateOwnerService } from '../application/owners/services/UpdateOwnerService';
import { DeleteOwnerService } from '../application/owners/services/DeleteOwnerService';
import { GetAllOwnersService } from '../application/owners/services/GetAllOwnersService';
import { GetOwnerByIdService } from '../application/owners/services/GetOwnerByIdService';
import { GetOwnerByEmailService } from '../application/owners/services/GetOwnerByEmailService';
import { GetOwnerByNameService } from '../application/owners/services/GetOwnerByNameService';

export function setupOwnerContainer(dataSource: DataSource): void {
  container.register<IOwnerRepository>('OwnerRepository', {
    useFactory: () => new OwnerRepository(dataSource),
  });

  container.register(CreateOwnerService, { useClass: CreateOwnerService });
  container.register(UpdateOwnerService, { useClass: UpdateOwnerService });
  container.register(DeleteOwnerService, { useClass: DeleteOwnerService });
  container.register(GetAllOwnersService, { useClass: GetAllOwnersService });
  container.register(GetOwnerByIdService, { useClass: GetOwnerByIdService });
  container.register(GetOwnerByEmailService, { useClass: GetOwnerByEmailService });
  container.register(GetOwnerByNameService, { useClass: GetOwnerByNameService });
}
