import { api } from '@/src/lib/axios';
import type { PetSearchResult } from '../types/pet.types';

export async function searchPets(query: string): Promise<PetSearchResult[]> {
  const response = await api.get(`/pets/name/${query}`);
  return response.data;
}
