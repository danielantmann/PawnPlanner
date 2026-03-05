import { api } from '@/src/lib/axios';
import type { BreedDTO } from '../types/breed.types';

export async function getBreedsByAnimal(animalId: number): Promise<BreedDTO[]> {
  const response = await api.get<BreedDTO[]>(`/breeds/animal/${animalId}`);
  return response.data;
}
