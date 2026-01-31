import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth.api';
import type { RegisterPayload } from '../types/auth.types';

import { useAuthStore } from '../store/auth.store';

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
    onSuccess: (data) => {
      console.log('REGISTER SUCCESS:', data);
      setSession(data.accessToken, data.refreshToken, data.user);
    },
  });
}
