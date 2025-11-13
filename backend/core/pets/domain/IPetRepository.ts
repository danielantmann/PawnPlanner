import { Pet } from './Pet';

export interface IPetRepository {
  save(pet: Pet): Promise<Pet>;
  update(id: number, data: Partial<Pet>): Promise<Pet | null>;

  findById(id: number): Promise<Pet | null>;
  findAll(): Promise<Pet[]>;
  findByName(name: string): Promise<Pet[]>;
  findByBreed(breedId: number): Promise<Pet[]>;
  delete(id: number): Promise<boolean>;
}
