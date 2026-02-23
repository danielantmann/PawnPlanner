import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateAppointment } from '../../hooks/useCreateAppointment';
import { api } from '@/src/lib/axios';

jest.mock('@/src/lib/axios', () => ({
  api: {
    post: jest.fn(),
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

describe('useCreateAppointment', () => {
  afterEach(() => {
    jest.clearAllMocks();
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('calls api.post with correct payload and returns data', async () => {
    const mockResponse = { data: { id: 1, name: 'Test' } };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(() => useCreateAppointment(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ foo: 'bar' } as any);
    });

    expect(api.post).toHaveBeenCalledWith('/appointments', { foo: 'bar' });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse.data);
    });
  });

  it('invalidates queries on success', async () => {
    const mockResponse = { data: { id: 1 } };
    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const client = createClient();
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');

    const wrapper = wrapperFactory(client);

    const { result } = renderHook(() => useCreateAppointment(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({ foo: 'bar' } as any);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['appointments'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard-today'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['dashboard-weekly'] });
  });
});
