import { api } from '@/src/lib/axios';
import type { OwnerDTO, CreateOwnerPayload, UpdateOwnerPayload } from '../types/owner.types';

export async function getAllOwners(): Promise<OwnerDTO[]> {
  const response = await api.get<OwnerDTO[]>('/owners');
  return response.data;
}

export async function getOwnerById(id: number): Promise<OwnerDTO> {
  const response = await api.get<OwnerDTO>(`/owners/${id}`);
  return response.data;
}

export async function searchOwnersByName(query: string): Promise<OwnerDTO[]> {
  const response = await api.get<OwnerDTO[]>(`/owners/name/${query}`);
  return response.data;
}

export async function createOwner(payload: CreateOwnerPayload): Promise<OwnerDTO> {
  const response = await api.post<OwnerDTO>('/owners', payload);
  return response.data;
}

export async function updateOwner(id: number, payload: UpdateOwnerPayload): Promise<OwnerDTO> {
  const response = await api.put<OwnerDTO>(`/owners/${id}`, payload);
  return response.data;
}

export async function deleteOwner(id: number): Promise<void> {
  await api.delete(`/owners/${id}`);
}
