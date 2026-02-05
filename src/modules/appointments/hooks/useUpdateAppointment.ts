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
      const response = await api.patch<AppointmentDTO>(`/appointments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['appointments'],
      });
    },
  });
}
