import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOwnerWithPet } from '../api/owners.api';
import type { CreateOwnerPayload } from '../types/owner.types';
import { normalizeOptional } from '@/src/utils/normalizeOptional';

interface CreateOwnerParams {
  owner: CreateOwnerPayload;
  pet?: {
    name: string;
    breedId: number;
    birthDate?: string | null;
    importantNotes?: string;
    quickNotes?: string;
  };
}

export const useCreateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateOwnerParams) =>
      createOwnerWithPet({
        ...params,
        owner: {
          ...params.owner,
          email: normalizeOptional(params.owner.email),
          phone: params.owner.phone.trim(),
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
  });
};
