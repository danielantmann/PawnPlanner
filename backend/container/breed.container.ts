import { Container } from 'tsyringe';
import { DataSource } from 'typeorm';
import { BreedRepository } from '../infrastructure/repositories/BreedRepository';
import { IBreedRepository } from '../core/breeds/domain/IBreedRepository';
import { CreateBreedService } from '../application/breeds/services/CreateBreedService';
import { UpdateBreedService } from '../application/breeds/services/UpdateBreedService';
import { DeleteBreedService } from '../application/breeds/services/DeleteBreedService';
import { GetAllBreedsService } from '../application/breeds/services/GetAllBreedsService';
import { GetBreedByIdService } from '../application/breeds/services/GetBreedByIdService';
import { GetBreedByNameService } from '../application/breeds/services/GetBreedByNameService';
import { GetBreedsByAnimalService } from '../application/breeds/services/GetBreedsByAnimalService';

export function setupBreedContainer(container: Container, dataSource: DataSource): void {
  container.register<IBreedRepository>('BreedRepository', {
    useFactory: () => new BreedRepository(dataSource),
  });

  container.register(CreateBreedService, { useClass: CreateBreedService });
  container.register(UpdateBreedService, { useClass: UpdateBreedService });
  container.register(DeleteBreedService, { useClass: DeleteBreedService });
  container.register(GetAllBreedsService, { useClass: GetAllBreedsService });
  container.register(GetBreedByIdService, { useClass: GetBreedByIdService });
  container.register(GetBreedByNameService, { useClass: GetBreedByNameService });
  container.register(GetBreedsByAnimalService, { useClass: GetBreedsByAnimalService });
}
