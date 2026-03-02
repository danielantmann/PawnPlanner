import { z } from 'zod';
import i18next from '@/src/i18n';

export const getPetSchema = () => {
  const t = i18next.t.bind(i18next);

  return z.object({
    name: z.string().min(1, t('pets.errors.nameRequired')),
    breedId: z
      .number()
      .nullable()
      .refine((v) => v !== null, t('pets.errors.breedRequired')),
    birthDate: z.string().nullable().optional(),
    importantNotes: z.string().optional(),
    quickNotes: z.string().optional(),
  });
};

export const validatePetForm = (data: unknown) => {
  try {
    const schema = getPetSchema();
    return { success: true, data: schema.parse(data) };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return { success: false, errors: { root: ['Error desconocido'] } };
  }
};
