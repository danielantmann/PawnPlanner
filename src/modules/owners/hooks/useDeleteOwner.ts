import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteOwner } from '../api/owners.api';

export function useDeleteOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteOwner(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
  });
}
