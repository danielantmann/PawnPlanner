import { api } from '@/src/lib/axios';
import type { ServiceDTO } from '../types/service.types';

export async function getServices(): Promise<ServiceDTO[]> {
  const response = await api.get('/services');
  return response.data;
}
