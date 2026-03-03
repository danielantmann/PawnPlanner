import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
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
  const { t } = useTranslation();

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
      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: t('owners.created'),
          position: 'top',
          topOffset: 20,
        });
      }, 400);
    },

    onError: () => {
      setTimeout(() => {
        Toast.show({
          type: 'error',
          text1: t('errors.unknownError'),
          position: 'top',
          topOffset: 20,
        });
      }, 400);
    },
  });
};
