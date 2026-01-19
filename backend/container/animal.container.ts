import { Container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { AnimalRepository } from '../infrastructure/repositories/AnimalRepository';
import { IAnimalRepository } from '../core/animals/domain/IAnimalRepository';
import { CreateAnimalService } from '../application/animals/services/CreateAnimalService';
import { UpdateAnimalService } from '../application/animals/services/UpdateAnimalService';
import { DeleteAnimalService } from '../application/animals/services/DeleteAnimalService';
import { GetAllAnimalsService } from '../application/animals/services/GetAllAnimalsService';
import { GetAnimalByIdService } from '../application/animals/services/GetAnimalByIdService';
import { GetAnimalsBySpeciesService } from '../application/animals/services/GetAnimalsBySpeciesService';

export function setupAnimalContainer(container: Container, dataSource: DataSource): void {
  container.register<IAnimalRepository>('AnimalRepository', {
    useFactory: () => new AnimalRepository(dataSource),
  });

  container.register(CreateAnimalService, { useClass: CreateAnimalService });
  container.register(UpdateAnimalService, { useClass: UpdateAnimalService });
  container.register(DeleteAnimalService, { useClass: DeleteAnimalService });
  container.register(GetAllAnimalsService, { useClass: GetAllAnimalsService });
  container.register(GetAnimalByIdService, { useClass: GetAnimalByIdService });
  container.register(GetAnimalsBySpeciesService, { useClass: GetAnimalsBySpeciesService });
}
