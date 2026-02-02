import { api } from '@/src/lib/axios';

export const refreshTokenApi = async (refreshToken: string) => {
  const { data } = await api.post('/auth/refresh', { refreshToken });
  return data;
};
