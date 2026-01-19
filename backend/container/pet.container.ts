import { Container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { PetRepository } from '../infrastructure/repositories/PetRepository';
import { IPetRepository } from '../core/pets/domain/IPetRepository';
import { CreatePetService } from '../application/pets/services/CreatePetService';
import { UpdatePetService } from '../application/pets/services/UpdatePetService';
import { DeletePetService } from '../application/pets/services/DeletePetService';
import { GetAllPetsService } from '../application/pets/services/GetAllPetsService';
import { GetPetByIdService } from '../application/pets/services/GetPetByIdService';
import { GetPetByNameService } from '../application/pets/services/GetPetByNameService';
import { GetPetByBreedService } from '../application/pets/services/GetPetByBreedService';

export function setupPetContainer(container: Container, dataSource: DataSource): void {
  container.register<IPetRepository>('PetRepository', {
    useFactory: () => new PetRepository(dataSource),
  });

  container.register(CreatePetService, { useClass: CreatePetService });
  container.register(UpdatePetService, { useClass: UpdatePetService });
  container.register(DeletePetService, { useClass: DeletePetService });
  container.register(GetAllPetsService, { useClass: GetAllPetsService });
  container.register(GetPetByIdService, { useClass: GetPetByIdService });
  container.register(GetPetByNameService, { useClass: GetPetByNameService });
  container.register(GetPetByBreedService, { useClass: GetPetByBreedService });
}
