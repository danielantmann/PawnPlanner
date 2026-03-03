import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { deleteOwner } from '../api/owners.api';

export function useDeleteOwner() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (id: number) => deleteOwner(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });

      setTimeout(() => {
        Toast.show({
          type: 'success',
          text1: t('owners.deleted'),
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
