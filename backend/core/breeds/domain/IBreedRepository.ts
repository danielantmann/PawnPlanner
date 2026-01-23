import { Breed } from './Breed';
import { BreedEntity } from '../../../infrastructure/orm/entities/BreedEntity';

export interface IBreedRepository {
  save(breed: Breed): Promise<Breed>;
  update(id: number, data: Partial<BreedEntity>, userId: number): Promise<Breed | null>;
  delete(id: number, userId: number): Promise<boolean>;

  findById(id: number, userId: number): Promise<Breed | null>;
  findByName(name: string, userId: number): Promise<Breed[]>;
  findAll(userId: number): Promise<Breed[]>;
  findByAnimal(animalId: number, userId: number): Promise<Breed[]>;

  findByNameAndAnimal(name: string, animalId: number, userId: number | null): Promise<Breed | null>;
}
