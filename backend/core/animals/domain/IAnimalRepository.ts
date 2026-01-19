import { Animal } from './Animal';
import { AnimalEntity } from '../../../infrastructure/orm/entities/AnimalEntity';

export interface IAnimalRepository {
  create(animal: Animal): Promise<Animal>;
  update(id: number, data: Partial<AnimalEntity>, userId: number): Promise<Animal | null>;
  delete(id: number, userId: number): Promise<boolean>;
  findAll(userId: number): Promise<Animal[]>;
  findById(id: number, userId: number): Promise<Animal | null>;
  findBySpecies(species: string, userId: number): Promise<Animal[]>;
}
