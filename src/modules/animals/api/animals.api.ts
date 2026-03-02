import { api } from '@/src/lib/axios';
import type { AnimalDTO } from '../types/animal.types';

export async function getAnimals(): Promise<AnimalDTO[]> {
  const response = await api.get<AnimalDTO[]>('/animals');
  return response.data;
}
