import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createAuthSchema } from '../schemas/authSchema';
import type { AuthMode } from '../types/auth.types';
import type { z } from 'zod';

import { useLogin } from '../hooks/useLogin';
import { useRegister } from '../hooks/useRegister';

// Tipo del formulario
export type AuthFormValues = z.infer<ReturnType<typeof createAuthSchema>>;

export const useAuthForm = (mode: AuthMode) => {
  const { t } = useTranslation();
  const isLogin = mode === 'login';

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(createAuthSchema(t, isLogin)),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const clearLoginError = () => {
    if (isLogin && loginMutation.isError) loginMutation.reset();
  };

  const onValidSubmit = (data: AuthFormValues) => {
    if (isLogin) {
      loginMutation.mutate({
        email: data.email.trim(),
        password: data.password,
      });
      return;
    }

    registerMutation.mutate({
      firstName: data.firstName?.trim() ?? '',
      lastName: data.lastName?.trim() ?? '',
      email: data.email.trim(),
      password: data.password,
    });
  };

  return {
    form,
    clearLoginError,
    onValidSubmit,
    loginMutation,
    isLogin,
    registerMutation,
  };
};
