import { container } from 'tsyringe';
import { PetRepository } from './infrastructure/repositories/PetRespository';
import { IPetRepository } from './core/pets/domain/IPetRepository';

container.register<IPetRepository>('PetRepository', {
  useClass: PetRepository,
});
