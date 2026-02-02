import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth.api';
import type { RegisterPayload } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';
import { router } from 'expo-router';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      console.log('REGISTER PAYLOAD:', payload);
      const res = await registerApi(payload);
      console.log('REGISTER RESPONSE:', res);
      return res;
    },

    onError: (err) => {
      console.log('REGISTER ERROR:', err);
    },

    onSuccess: async (data) => {
      console.log('REGISTER SUCCESS:', data);

      await setSession(data.accessToken, data.refreshToken, data.user);
      router.replace('/(protected)/(tabs)/home');
    },
  });
}
