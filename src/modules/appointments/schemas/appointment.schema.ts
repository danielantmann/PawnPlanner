import { z } from 'zod';
import i18next from '@/src/i18n';

// ⭐ Crea función que retorna el schema CON las traducciones cargadas
const getAppointmentSchema = () => {
  const t = i18next.t.bind(i18next);

  return z
    .object({
      petId: z.string().min(1, t('appointments.errors.petRequired')),
      serviceId: z.string().min(1, t('appointments.errors.serviceRequired')),
      workerId: z.string().optional(),
      startTime: z
        .string()
        .min(1, t('appointments.errors.startTimeRequired'))
        .regex(/^\d{2}:\d{2}$/, t('appointments.errors.startTimeInvalid')),
      endTime: z
        .string()
        .min(1, t('appointments.errors.endTimeRequired'))
        .regex(/^\d{2}:\d{2}$/, t('appointments.errors.endTimeInvalid')),
      finalPrice: z
        .string()
        .optional()
        .refine(
          (val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
          t('appointments.errors.priceFormat')
        )
        .refine(
          (val) => !val || parseFloat(val) > 0,
          t('appointments.errors.priceGreaterThanZero')
        ),
      status: z.enum(['completed', 'no-show', 'cancelled']),
    })
    .refine(
      (data) => {
        if (!/^\d{2}:\d{2}$/.test(data.startTime)) return true;
        if (!/^\d{2}:\d{2}$/.test(data.endTime)) return true;

        const [startH, startM] = data.startTime.split(':').map(Number);
        const [endH, endM] = data.endTime.split(':').map(Number);

        const startTotalMinutes = startH * 60 + startM;
        const endTotalMinutes = endH * 60 + endM;

        return endTotalMinutes > startTotalMinutes;
      },
      {
        message: t('appointments.errors.endTimeAfterStart'),
        path: ['endTime'],
      }
    );
};

export type AppointmentFormState = z.infer<ReturnType<typeof getAppointmentSchema>>;

export const validateAppointmentForm = (data: unknown) => {
  try {
    const schema = getAppointmentSchema(); // ⭐ Genera el schema CON traducciones
    return {
      success: true,
      data: schema.parse(data),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      };
    }

    return {
      success: false,
      errors: { root: ['Error desconocido'] },
    };
  }
};
