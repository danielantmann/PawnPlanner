import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth.api';
import type { RegisterPayload } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';
import { router } from 'expo-router';
import { createWorkerApi } from '../../workers/api/workers.api';

export function useRegister() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      console.log('REGISTER PAYLOAD:', payload);
      const res = await registerApi(payload);
      console.log('REGISTER RESPONSE:', res);
      return res;
    },

    onError: (err: any) => {
      console.log('REGISTER ERROR:', err.response?.data);

      const backendErrors = err.response?.data?.errors;

      if (backendErrors) {
        backendErrors.forEach((e: any) => {
          console.log(`Field: ${e.field}`);
          console.log(`Messages:`, Object.values(e.constraints));
        });
      }
    },

    onSuccess: async (data) => {
      console.log('REGISTER SUCCESS:', data);

      await setSession(data.accessToken, data.refreshToken, data.user);

      try {
        const fullName = `${data.user.firstName} ${data.user.lastName}`;

        await createWorkerApi({
          name: fullName,
        });
        console.log('WORKER CREATED SUCCESSFULLY');
      } catch (err) {
        console.log('ERROR CREATING WORKER:', err);
      }
      router.replace('/(protected)/(tabs)/home');
    },
  });
}
