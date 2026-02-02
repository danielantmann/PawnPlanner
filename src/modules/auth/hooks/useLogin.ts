import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth.api';
import type { LoginPayload } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';
import { AUTH_ERROR_MAP } from '../errors/authErrors';
import { router } from 'expo-router';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        return await loginApi(payload);
      } catch (error: any) {
        const backendMessage = error?.response?.data?.message;

        if (backendMessage && AUTH_ERROR_MAP[backendMessage]) {
          throw new Error(AUTH_ERROR_MAP[backendMessage]);
        }

        throw new Error('auth.unexpected');
      }
    },

    onSuccess: (data) => {
      // Sin await - actualiza Zustand de forma síncrona
      setSession(data.accessToken, data.refreshToken, data.user);

      // La redirección se ejecuta inmediatamente después
      router.replace('/(protected)/(tabs)/home');
    },
  });
}
