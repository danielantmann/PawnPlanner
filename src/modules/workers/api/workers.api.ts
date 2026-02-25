import { api } from '@/src/lib/axios';
import type { WorkerDTO } from '../types/worker.types';

export async function getWorkers() {
  const response = await api.get<WorkerDTO[]>('/workers');
  return response.data;
}

export async function createWorkerApi(payload: { name: string; phone?: string }) {
  const response = await api.post('/workers', payload);
  return response.data;
}
