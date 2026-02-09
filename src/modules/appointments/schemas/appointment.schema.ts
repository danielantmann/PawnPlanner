import { z } from 'zod';

export const appointmentFormSchema = z.object({
  petId: z.number().int().positive('Selecciona una mascota'),
  serviceId: z.number().int().positive('Selecciona un servicio'),
  startTime: z.string().time('Hora de inicio inválida'),
  endTime: z.string().time('Hora de fin inválida'),
  finalPrice: z.number().positive('El precio debe ser mayor a 0').optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export const validateAppointmentForm = (data: unknown) => {
  try {
    return {
      success: true,
      data: appointmentFormSchema.parse(data),
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
