import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { useCreateAppointment } from './useCreateAppointment';
import { useUpdateAppointment } from './useUpdateAppointment';
import { useDeleteAppointment } from './useDeleteAppointment';
import { validateAppointmentForm } from '../schemas/appointment.schema';
import { getErrorMessage } from '../../../utils/errorHandler';
import type {
  AppointmentDTO,
  CreateAppointmentPayload,
  AppointmentFormState,
} from '../types/appointment.types';

interface UseAppointmentSubmitProps {
  selectedDate: Date;
  onSuccess: () => void;
}

interface UseAppointmentSubmitReturn {
  handleSubmit: (
    formState: AppointmentFormState,
    isEditMode: boolean,
    setFormErrors: (errors: Record<string, string[]>) => void,
    appointment?: AppointmentDTO | null
  ) => void;
  handleDelete: (appointment: AppointmentDTO) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export const useAppointmentSubmit = ({
  selectedDate,
  onSuccess,
}: UseAppointmentSubmitProps): UseAppointmentSubmitReturn => {
  const { t } = useTranslation();

  const { mutate: createAppointment, isPending: isCreating } = useCreateAppointment();
  const { mutate: updateAppointment, isPending: isUpdating } = useUpdateAppointment();
  const { mutate: deleteAppointment, isPending: isDeleting } = useDeleteAppointment();

  const buildISODateTime = (date: Date, time: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const mm = String(Math.abs(offset) % 60).padStart(2, '0');

    return `${year}-${month}-${day}T${time}:00${sign}${hh}:${mm}`;
  };

  const handleSubmit = useCallback(
    (
      formState: AppointmentFormState,
      isEditMode: boolean,
      setFormErrors: (errors: Record<string, string[]>) => void,
      appointment?: AppointmentDTO | null
    ) => {
      const validation = validateAppointmentForm(formState);

      if (!validation.success) {
        setFormErrors(validation.errors as Record<string, string[]>);
        return;
      }

      const startISO = buildISODateTime(selectedDate, formState.startTime);
      const endISO = buildISODateTime(selectedDate, formState.endTime);

      if (isEditMode && appointment) {
        updateAppointment(
          {
            id: appointment.id,
            data: {
              petId: parseInt(formState.petId),
              serviceId: parseInt(formState.serviceId),
              startTime: startISO,
              endTime: endISO,
              finalPrice: formState.finalPrice ? parseFloat(formState.finalPrice) : undefined,
              status: formState.status,
              workerId: formState.workerId ? parseInt(formState.workerId) : undefined,
            },
          },
          {
            onSuccess: () => {
              onSuccess();
              setTimeout(() => {
                Toast.show({
                  type: 'success',
                  text1: t('appointments.updated'),
                  position: 'top',
                  topOffset: 60,
                });
              }, 400);
            },
            onError: (error: any) => {
              const message = getErrorMessage(error);
              setTimeout(() => {
                Toast.show({
                  type: 'error',
                  text1: message,
                  position: 'top',
                  topOffset: 60,
                });
              }, 400);
            },
          }
        );
      } else {
        const payload: CreateAppointmentPayload = {
          petId: parseInt(formState.petId),
          serviceId: parseInt(formState.serviceId),
          startTime: startISO,
          endTime: endISO,
          finalPrice: formState.finalPrice ? parseFloat(formState.finalPrice) : undefined,
          workerId: formState.workerId ? parseInt(formState.workerId) : undefined,
        };

        createAppointment(payload, {
          onSuccess: () => {
            onSuccess();
            setTimeout(() => {
              Toast.show({
                type: 'success',
                text1: t('appointments.created'),
                position: 'top',
                topOffset: 60,
              });
            }, 400);
          },
          onError: (error: any) => {
            const message = getErrorMessage(error);
            setTimeout(() => {
              Toast.show({
                type: 'error',
                text1: message,
                position: 'top',
                topOffset: 60,
              });
            }, 400);
          },
        });
      }
    },
    [selectedDate, createAppointment, updateAppointment, onSuccess, t]
  );

  const handleDelete = useCallback(
    (appointment: AppointmentDTO) => {
      deleteAppointment(appointment.id, {
        onSuccess: () => {
          onSuccess();
          setTimeout(() => {
            Toast.show({
              type: 'success',
              text1: t('appointments.deleted'),
              position: 'top',
              topOffset: 60,
            });
          }, 400);
        },
        onError: (error: any) => {
          const message = getErrorMessage(error);
          setTimeout(() => {
            Toast.show({
              type: 'error',
              text1: message,
              position: 'top',
              topOffset: 60,
            });
          }, 400);
        },
      });
    },
    [deleteAppointment, onSuccess, t]
  );

  return {
    handleSubmit,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting,
  };
};
