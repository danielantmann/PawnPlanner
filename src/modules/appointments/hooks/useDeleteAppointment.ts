import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/lib/axios';

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/appointments/${id}`);
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
