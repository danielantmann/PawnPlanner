import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createAuthSchema = (t: TFunction, isLogin: boolean) =>
  z.object({
    email: z.string().min(1, t('auth.errors.emailRequired')).email(t('auth.errors.emailInvalid')),

    password: z
      .string()
      .min(8, t('auth.errors.passwordInvalid'))
      .regex(/[A-Z]/, t('auth.errors.passwordInvalid'))
      .regex(/\d/, t('auth.errors.passwordInvalid'))
      .regex(/[^A-Za-z0-9]/, t('auth.errors.passwordInvalid')),

    firstName: isLogin
      ? z.string().optional()
      : z.string().min(1, t('auth.errors.firstNameRequired')),

    lastName: isLogin
      ? z.string().optional()
      : z.string().min(1, t('auth.errors.lastNameRequired')),
  });
