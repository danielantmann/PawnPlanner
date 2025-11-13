import { Animal } from './Animal';

export interface IAnimalRepository {
  create(animal: Animal): Promise<Animal>;
  update(id: number, species: string): Promise<Animal | null>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<Animal[]>;
  findById(id: number): Promise<Animal | null>;
  findBySpecies(species: string): Promise<Animal | null>;
}
