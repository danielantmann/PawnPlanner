import { renderHook, act } from '@testing-library/react-native';
import Toast from 'react-native-toast-message';
import { useAppointmentSubmit } from '../../hooks/useAppointmentSubmit';
import { validateAppointmentForm } from '../../schemas/appointment.schema';
import type { AppointmentFormState } from '../../types/appointment.types';

import { useCreateAppointment } from '../../hooks/useCreateAppointment';
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment';
import { useDeleteAppointment } from '../../hooks/useDeleteAppointment';

jest.useFakeTimers();

jest.mock('../../schemas/appointment.schema', () => ({
  validateAppointmentForm: jest.fn(),
}));

jest.mock('../../hooks/useCreateAppointment');
jest.mock('../../hooks/useUpdateAppointment');
jest.mock('../../hooks/useDeleteAppointment');

jest.mock('react-native-toast-message', () => ({
  show: jest.fn(),
}));

jest.mock('../../../../utils/errorHandler', () => ({
  getErrorMessage: jest.fn().mockReturnValue('Error message'),
}));

function createMutationMock() {
  return {
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    data: undefined,
    error: null,
    variables: undefined,
    isPending: false,
    isSuccess: false,
    isError: false,
    reset: jest.fn(),
    status: 'idle',
  };
}

describe('useAppointmentSubmit', () => {
  const mockOnSuccess = jest.fn();
  const selectedDate = new Date('2024-01-01T00:00:00Z');

  const validForm: AppointmentFormState = {
    petId: '1',
    serviceId: '2',
    startTime: '10:00',
    endTime: '11:00',
    finalPrice: '30',
    status: 'completed',
    workerId: '5',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useCreateAppointment as jest.Mock).mockReturnValue(createMutationMock());
    (useUpdateAppointment as jest.Mock).mockReturnValue(createMutationMock());
    (useDeleteAppointment as jest.Mock).mockReturnValue(createMutationMock());
  });

  it('should set form errors when validation fails', () => {
    (validateAppointmentForm as jest.Mock).mockReturnValue({
      success: false,
      errors: { petId: ['Required'] },
    });

    const setFormErrors = jest.fn();

    const { result } = renderHook(() =>
      useAppointmentSubmit({ selectedDate, onSuccess: mockOnSuccess })
    );

    act(() => {
      result.current.handleSubmit(validForm, false, setFormErrors);
    });

    expect(setFormErrors).toHaveBeenCalledWith({ petId: ['Required'] });
  });

  it('should call createAppointment on create mode', () => {
    const createMock = createMutationMock();

    createMock.mutate.mockImplementation((payload, opts) => {
      opts.onSuccess?.();
    });

    (useCreateAppointment as jest.Mock).mockReturnValue(createMock);
    (validateAppointmentForm as jest.Mock).mockReturnValue({ success: true });

    const { result } = renderHook(() =>
      useAppointmentSubmit({ selectedDate, onSuccess: mockOnSuccess })
    );

    act(() => {
      result.current.handleSubmit(validForm, false, jest.fn());
    });

    jest.runAllTimers();

    expect(createMock.mutate).toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should call updateAppointment on edit mode', () => {
    const updateMock = createMutationMock();

    updateMock.mutate.mockImplementation((payload, opts) => {
      opts.onSuccess?.();
    });

    (useUpdateAppointment as jest.Mock).mockReturnValue(updateMock);
    (validateAppointmentForm as jest.Mock).mockReturnValue({ success: true });

    const appointment = { id: 99 } as any;

    const { result } = renderHook(() =>
      useAppointmentSubmit({ selectedDate, onSuccess: mockOnSuccess })
    );

    act(() => {
      result.current.handleSubmit(validForm, true, jest.fn(), appointment);
    });

    jest.runAllTimers();

    expect(updateMock.mutate).toHaveBeenCalled();
    expect(Toast.show).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should call deleteAppointment', () => {
    const deleteMock = createMutationMock();

    deleteMock.mutate.mockImplementation((id, opts) => {
      opts.onSuccess?.();
    });

    (useDeleteAppointment as jest.Mock).mockReturnValue(deleteMock);

    const { result } = renderHook(() =>
      useAppointmentSubmit({ selectedDate, onSuccess: mockOnSuccess })
    );

    act(() => {
      result.current.handleDelete({ id: 10 } as any);
    });

    jest.runAllTimers();

    expect(deleteMock.mutate).toHaveBeenCalledWith(10, expect.any(Object));
    expect(Toast.show).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('should show error toast on create error', () => {
    const createMock = createMutationMock();

    createMock.mutate.mockImplementation((payload, opts) => {
      opts.onError?.('err');
    });

    (useCreateAppointment as jest.Mock).mockReturnValue(createMock);
    (validateAppointmentForm as jest.Mock).mockReturnValue({ success: true });

    const { result } = renderHook(() =>
      useAppointmentSubmit({ selectedDate, onSuccess: mockOnSuccess })
    );

    act(() => {
      result.current.handleSubmit(validForm, false, jest.fn());
    });

    jest.runAllTimers();

    expect(Toast.show).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
