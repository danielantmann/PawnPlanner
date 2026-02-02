import axios from 'axios';
import { tokenManager } from '@/src/modules/auth/token.manager';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = tokenManager.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refresh = tokenManager.getRefreshToken();
      if (!refresh) return Promise.reject(error);

      try {
        // Importa dinámicamente para evitar ciclo
        const { refreshTokenApi } = await import('@/src/modules/auth/api/refresh.api');
        const data = await refreshTokenApi(refresh);

        tokenManager.setTokens(data.accessToken, data.refreshToken);

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (err) {
        tokenManager.clear();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);
