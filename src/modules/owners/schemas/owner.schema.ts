import { z } from 'zod';
import i18next from '@/src/i18n';

const getOwnerSchema = () => {
  const t = i18next.t.bind(i18next);

  return z.object({
    name: z
      .string()
      .min(2, t('owners.errors.nameRequired'))
      .max(50, t('owners.errors.nameTooLong')),

    email: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        t('owners.errors.emailInvalid')
      ),

    phone: z
      .string()
      .min(1, t('owners.errors.phoneRequired'))
      .regex(/^\+?[\d\s\-]{7,15}$/, t('owners.errors.phoneInvalid')),
  });
};

export const validateOwnerForm = (data: unknown) => {
  try {
    const schema = getOwnerSchema();
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, errors: { root: ['Error desconocido'] } };
  }
};
