import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth.api';
import type { LoginPayload } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';
import { AUTH_ERROR_MAP } from '../errors/authErrors';

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        return await loginApi(payload);
      } catch (error: any) {
        const backendMessage = error?.response?.data?.message;

        if (backendMessage && AUTH_ERROR_MAP[backendMessage]) {
          throw new Error(AUTH_ERROR_MAP[backendMessage]); // clave i18n
        }

        throw new Error('auth.unexpected');
      }
    },

    onSuccess: (data) => {
      setSession(data.accessToken, data.refreshToken, data.user);
    },
  });
}
