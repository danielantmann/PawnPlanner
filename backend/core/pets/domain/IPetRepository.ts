import { Pet } from './Pet';

export interface IPetRepository {
  save(pet: Pet): Promise<Pet>;
  update(id: number, data: Partial<Pet>, userId: number): Promise<Pet | null>;

  findById(id: number, userId: number): Promise<Pet | null>;
  findAll(userId: number): Promise<Pet[]>;
  findByName(name: string, userId: number): Promise<Pet[]>;
  findByBreed(breedId: number, userId: number): Promise<Pet[]>;
  delete(id: number, userId: number): Promise<boolean>;
}
