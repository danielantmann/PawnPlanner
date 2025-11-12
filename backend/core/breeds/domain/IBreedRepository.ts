import { Breed } from './Breed';

export interface IBreedRepository {
  save(breed: Breed): Promise<Breed>;
  update(breed: Breed): Promise<Breed | null>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<Breed | null>;
  findByName(name: string): Promise<Breed[]>;
  findAll(): Promise<Breed[]>;
}
