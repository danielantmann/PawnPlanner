import { Breed } from './Breed';

export interface IBreedRepository {
  save(breed: Breed): Promise<Breed>;
  update(id: number, data: Partial<Breed>, userId: number): Promise<Breed | null>;
  delete(id: number, userId: number): Promise<boolean>;

  findById(id: number, userId: number): Promise<Breed | null>;
  findByName(name: string, userId: number): Promise<Breed[]>;
  findAll(userId: number): Promise<Breed[]>;
  findByAnimal(animalId: number, userId: number): Promise<Breed[]>;

  findByNameAndAnimal(name: string, animalId: number, userId: number): Promise<Breed | null>;
}
