import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteAppointment } from '../../hooks/useDeleteAppointment';
import { api } from '@/src/lib/axios';

jest.mock('@/src/lib/axios', () => ({
  api: {
    delete: jest.fn(),
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

describe('useDeleteAppointment', () => {
  afterEach(() => {
    jest.clearAllMocks();
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('calls api.delete with correct id', async () => {
    (api.delete as jest.Mock).mockResolvedValue(undefined);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(() => useDeleteAppointment(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(10);
    });

    expect(api.delete).toHaveBeenCalledWith('/appointments/10');
  });

  it('invalidates queries on success', async () => {
    (api.delete as jest.Mock).mockResolvedValue(undefined);

    const client = createClient();
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');

    const wrapper = wrapperFactory(client);

    const { result } = renderHook(() => useDeleteAppointment(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(10);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['appointments'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard-today'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard-weekly'] });
  });
});
