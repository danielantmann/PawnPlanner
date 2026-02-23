import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment';
import { api } from '@/src/lib/axios';
import type { UpdateAppointmentPayload } from '../../types/appointment.types';

jest.mock('@/src/lib/axios', () => ({
  api: {
    put: jest.fn(),
  },
}));

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

function wrapperFactory(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useUpdateAppointment', () => {
  afterEach(() => {
    jest.clearAllMocks();
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  const validPayload: UpdateAppointmentPayload = {
    petId: 1,
    serviceId: 2,
    startTime: '10:00',
    endTime: '11:00',
    finalPrice: 30,
    status: 'completed',
    workerId: 5,
  };

  it('calls api.put with correct id and payload, and returns data', async () => {
    const mockResponse = { data: { id: 1, name: 'Updated' } };
    (api.put as jest.Mock).mockResolvedValue(mockResponse);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(() => useUpdateAppointment(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: 10,
        data: validPayload,
      });
    });

    expect(api.put).toHaveBeenCalledWith('/appointments/10', validPayload);

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse.data);
    });
  });

  it('invalidates queries on success', async () => {
    const mockResponse = { data: { id: 1 } };
    (api.put as jest.Mock).mockResolvedValue(mockResponse);

    const client = createClient();
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');

    const wrapper = wrapperFactory(client);

    const { result } = renderHook(() => useUpdateAppointment(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        id: 10,
        data: validPayload,
      });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['appointments'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard-today'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard-weekly'] });
  });
});
