import { api } from '@/src/lib/axios';
import type { WorkerDTO } from '../types/worker.types';

export async function getWorkers() {
  const response = await api.get<WorkerDTO[]>('/workers');
  return response.data;
}
