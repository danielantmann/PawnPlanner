import { api } from '@/src/lib/axios';
import type { RegisterPayload, LoginPayload } from '../types/auth.types';

export async function loginApi(payload: LoginPayload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function registerApi(payload: RegisterPayload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function refreshTokenApi(refreshToken: string) {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data;
}
