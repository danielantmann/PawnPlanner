import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAppointmentForm } from '../../hooks/useAppointmentForm';

// Mock workers hook
jest.mock('../../../workers/hooks/useGetWorkers', () => ({
  useGetWorkers: () => ({
    data: [{ id: 1, name: 'Worker 1', isActive: true, maxSimultaneous: null }],
  }),
}));

// Mock pets hook
jest.mock('../../../pets/hooks/useSearchPets', () => ({
  useSearchPets: () => ({
    data: [
      { id: 10, name: 'Firulais' },
      { id: 11, name: 'Otro perro' },
    ],
  }),
}));

// Mock services hook
jest.mock('../../../services/hooks/useServices', () => ({
  useServices: () => ({
    data: [
      { id: 20, name: 'Baño', price: 25 },
      { id: 21, name: 'Corte', price: 30 },
    ],
  }),
}));

// Mock reducer
jest.mock('../../reducers/appointmentFormReducer', () => ({
  appointmentFormReducer: (state: any, action: any) => {
    if (action.type === 'SET_FIELD') {
      return { ...state, [action.field]: action.value };
    }
    if (action.type === 'RESET') {
      return {
        petId: '',
        serviceId: '',
        workerId: '',
        startTime: '09:00',
        endTime: '10:00',
        finalPrice: '',
        status: 'completed',
      };
    }
    return state;
  },
}));

jest.mock('../../reducers/appointmentInitialState', () => ({
  appointmentInitialState: {
    petId: '',
    serviceId: '',
    workerId: '',
    startTime: '09:00',
    endTime: '10:00',
    finalPrice: '',
    status: 'completed',
  },
}));

describe('useAppointmentForm', () => {
  const mockAppointment = {
    id: 1,
    ownerName: 'Test Owner',
    ownerPhone: '000000000',

    petId: 10,
    petName: 'Firulais',
    serviceId: 20,
    serviceName: 'Baño',
    estimatedPrice: 25,
    finalPrice: 30,
    workerId: 1,
    workerName: 'Worker 1',
    startTime: '2024-01-01T10:00:00Z',
    endTime: '2024-01-01T11:00:00Z',
    status: 'completed',
  } as const;

  it('should initialize empty form in create mode', () => {
    const { result } = renderHook(() => useAppointmentForm({ visible: true, isEditMode: false }));

    expect(result.current.formState.petId).toBe('');
    expect(result.current.formState.serviceId).toBe('');
    expect(result.current.selectedPet).toBe(null);
    expect(result.current.selectedService).toBe(null);
  });

  it('should auto-select worker when only one exists', () => {
    const { result } = renderHook(() => useAppointmentForm({ visible: true }));

    expect(result.current.selectedWorker?.id).toBe(1);
    expect(result.current.formState.workerId).toBe('1');
  });

  it('should initialize form in edit mode', async () => {
    const { result } = renderHook(() =>
      useAppointmentForm({
        visible: true,
        isEditMode: true,
        appointment: mockAppointment,
      })
    );

    expect(result.current.formState.petId).toBe('10');
    expect(result.current.formState.serviceId).toBe('20');
    expect(result.current.formState.finalPrice).toBe('30');

    await waitFor(() => expect(result.current.selectedPet?.name).toBe('Firulais'));

    await waitFor(() => expect(result.current.selectedService?.name).toBe('Baño'));

    expect(result.current.recommendedPrice).toBe('25');
  });

  it('should set form field and clear errors', () => {
    const { result } = renderHook(() => useAppointmentForm({ visible: true }));

    act(() => {
      result.current.setFormErrors({ petId: ['Required'] });
    });

    act(() => {
      result.current.setFormField('petId', '123');
    });

    expect(result.current.formState.petId).toBe('123');
    expect(result.current.formErrors.petId).toEqual([]);
  });

  it('should reset form when modal closes', () => {
    const { result, rerender } = renderHook((props: any) => useAppointmentForm(props), {
      initialProps: { visible: true },
    });

    act(() => {
      result.current.setFormField('petId', '999');
    });

    rerender({ visible: false });

    expect(result.current.formState.petId).toBe('');
    expect(result.current.selectedPet).toBe(null);
  });

  it('should initialize start and end time when selectedHour/minute provided', () => {
    const { result } = renderHook(() =>
      useAppointmentForm({
        visible: true,
        selectedHour: 14,
        selectedMinute: 30,
      })
    );

    expect(result.current.formState.startTime).toBe('14:30');
    expect(result.current.formState.endTime).toBe('15:30');
  });

  it('should not reinitialize when visible stays true', () => {
    const { result, rerender } = renderHook((props: any) => useAppointmentForm(props), {
      initialProps: { visible: true },
    });

    const firstState = result.current.formState.startTime;

    rerender({ visible: true });

    expect(result.current.formState.startTime).toBe(firstState);
  });
});
