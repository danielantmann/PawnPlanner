import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/lib/axios';

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-today'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-weekly'] });
    },
  });
}
