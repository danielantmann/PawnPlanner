import { Animal } from './Animal';

export interface IAnimalRepository {
  create(animal: Animal): Promise<Animal>;
  update(id: number, species: string): Promise<Animal>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Animal[]>;
  findById(id: number): Promise<Animal>;
  findBySpecies(species: string): Promise<Animal>;
}
