import { useReducer, useEffect, useState, useCallback, useRef } from 'react';
import { useGetWorkers } from '@/src/modules/workers/hooks/useGetWorkers';
import { appointmentFormReducer } from '../reducers/appointmentFormReducer';
import { appointmentInitialState } from '../reducers/appointmentInitialState';
import type { AppointmentDTO, AppointmentFormState } from '../types/appointment.types';
import type { PetSearchResult } from '@/src/modules/pets/types/pet.types';
import type { ServiceDTO } from '@/src/modules/services/types/service.types';
import type { WorkerDTO } from '@/src/modules/workers/types/worker.types';

interface UseAppointmentFormProps {
  appointment?: AppointmentDTO | null;
  isEditMode?: boolean;
  selectedHour?: number | null;
  selectedMinute?: number | null;
  visible?: boolean;
}

export const useAppointmentForm = ({
  appointment,
  isEditMode = false,
  selectedHour,
  selectedMinute,
  visible,
}: UseAppointmentFormProps) => {
  const { data: workers } = useGetWorkers();

  const [formState, dispatch] = useReducer(appointmentFormReducer, appointmentInitialState);
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [selectedPet, setSelectedPet] = useState<PetSearchResult | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceDTO | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<WorkerDTO | null>(null);
  const [recommendedPrice, setRecommendedPrice] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const hasInitialized = useRef(false);

  const setFormField = useCallback(
    (field: keyof AppointmentFormState, value: string) => {
      dispatch({ type: 'SET_FIELD', field, value });
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: [] }));
      }
    },
    [formErrors]
  );

  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET' });
    setFormErrors({});
    setSelectedPet(null);
    setSelectedService(null);
    setSelectedWorker(null);
    setRecommendedPrice('');
    setShowStartPicker(false);
    setShowEndPicker(false);
  }, []);

  /**
   * RESET cuando el modal se cierra
   */
  useEffect(() => {
    if (!visible) {
      hasInitialized.current = false;
      resetForm();
    }
  }, [visible, resetForm]);

  /**
   * Inicialización cuando el modal se abre
   */
  useEffect(() => {
    if (!visible || hasInitialized.current) return;

    hasInitialized.current = true;

    // MODO EDICIÓN
    if (isEditMode && appointment) {
      setFormField('petId', String(appointment.petId));
      setFormField('serviceId', String(appointment.serviceId));
      setFormField('finalPrice', String(appointment.finalPrice || 0));
      setFormField('status', appointment.status);

      if (appointment.workerId) {
        setFormField('workerId', String(appointment.workerId));
        setSelectedWorker({
          id: appointment.workerId,
          name: appointment.workerName || '',
          isActive: true,
          maxSimultaneous: null,
        });
      }

      const startDate = new Date(appointment.startTime);
      const endDate = new Date(appointment.endTime);

      setFormField(
        'startTime',
        `${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}`
      );
      setFormField(
        'endTime',
        `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
      );

      setTimeout(() => {
        setSelectedPet({ id: appointment.petId, name: appointment.petName } as any);
        setSelectedService({
          id: appointment.serviceId,
          name: appointment.serviceName,
          price: appointment.estimatedPrice || 0,
        } as any);
        setRecommendedPrice(String(appointment.estimatedPrice || 0));
      }, 0);

      return;
    }

    // MODO CREAR
    if (workers && workers.length === 1) {
      setSelectedWorker(workers[0]);
      setFormField('workerId', String(workers[0].id));
    }

    if (selectedHour != null && selectedMinute != null) {
      const start = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
      const end = `${String(selectedHour + 1).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;

      setFormField('startTime', start);
      setFormField('endTime', end);
    }
  }, [visible, isEditMode, appointment, workers, selectedHour, selectedMinute, setFormField]);

  return {
    formState,
    formErrors,
    selectedPet,
    setSelectedPet,
    selectedService,
    setSelectedService,
    selectedWorker,
    setSelectedWorker,
    recommendedPrice,
    setRecommendedPrice,
    showStartPicker,
    setShowStartPicker,
    showEndPicker,
    setShowEndPicker,
    setFormField,
    setFormErrors,
    resetForm,
  };
};
