import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOwner } from '../api/owners.api';
import type { UpdateOwnerPayload } from '../types/owner.types';

export function useUpdateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOwnerPayload }) =>
      updateOwner(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['owners', id] });
    },
  });
}
