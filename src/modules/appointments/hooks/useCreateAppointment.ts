import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/lib/axios';
import type { AppointmentDTO, CreateAppointmentPayload } from '../types/appointment.types';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAppointmentPayload): Promise<AppointmentDTO> => {
      const response = await api.post<AppointmentDTO>('/appointments', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-today'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-weekly'] });
    },
  });
}
