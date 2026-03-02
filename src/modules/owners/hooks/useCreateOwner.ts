import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOwner } from '../api/owners.api';
import type { CreateOwnerPayload } from '../types/owner.types';

export function useCreateOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOwnerPayload) => createOwner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
  });
}
