import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/lib/axios';
import type { AppointmentDTO, UpdateAppointmentPayload } from '../types/appointment.types';

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateAppointmentPayload;
    }): Promise<AppointmentDTO> => {
      const response = await api.put<AppointmentDTO>(`/appointments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      // ⭐ INVALIDA TODAS LAS QUERIES DE APPOINTMENTS
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });

      // ⭐ INVALIDA LAS STATS DEL DASHBOARD
      queryClient.invalidateQueries({
        queryKey: ['dashboard-today'],
      });
      queryClient.invalidateQueries({
        queryKey: ['dashboard-weekly'],
      });
    },
  });
}
