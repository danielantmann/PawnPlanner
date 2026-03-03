import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { updateOwner } from '../api/owners.api';
import type { UpdateOwnerPayload } from '../types/owner.types';
import { normalizeOptional } from '@/src/utils/normalizeOptional';

export function useUpdateOwner() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOwnerPayload }) =>
      updateOwner(id, {
        ...payload,
        email: normalizeOptional(payload.email),
        phone: payload.phone?.trim(),
      }),

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['owners', id] });

      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: t('owners.updated'),
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
}
