import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppointments } from '../../hooks/useAppointments';
import { getAppointments } from '../../api/appointments.api';

jest.mock('../../api/appointments.api', () => ({
  getAppointments: jest.fn(),
}));

// ⭐ Necesitamos fake timers porque React Query usa timers internos
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

function createClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function wrapperFactory(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useAppointments (advanced suite)', () => {
  afterEach(() => {
    jest.clearAllMocks();

    // ⭐ React exige que cualquier timer que cause renders esté dentro de act()
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('fetches appointments with correct params', async () => {
    const mockData = [{ id: 1 }];
    (getAppointments as jest.Mock).mockResolvedValue(mockData);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(
      () => useAppointments({ start: '2024-01-01', end: '2024-01-31' }),
      { wrapper }
    );

    await waitFor(() =>
      expect(getAppointments).toHaveBeenCalledWith({
        start: '2024-01-01',
        end: '2024-01-31',
      })
    );

    await waitFor(() => expect(result.current.data).toEqual(mockData));
  });

  it('exposes loading state', () => {
    (getAppointments as jest.Mock).mockReturnValue(new Promise(() => {}));

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(
      () => useAppointments({ start: '2024-01-01', end: '2024-01-31' }),
      { wrapper }
    );

    expect(result.current.isLoading).toBe(true);
  });

  it('exposes error state', async () => {
    (getAppointments as jest.Mock).mockRejectedValue(new Error('Error'));

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(
      () => useAppointments({ start: '2024-01-01', end: '2024-01-31' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.error).toBeTruthy());
  });

  it('caches results and avoids refetching with same params', async () => {
    const mockData = [{ id: 1 }];
    (getAppointments as jest.Mock).mockResolvedValue(mockData);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    renderHook(() => useAppointments({ start: '2024-01-01', end: '2024-01-31' }), { wrapper });

    await waitFor(() => expect(getAppointments).toHaveBeenCalledTimes(1));

    renderHook(() => useAppointments({ start: '2024-01-01', end: '2024-01-31' }), { wrapper });

    expect(getAppointments).toHaveBeenCalledTimes(1);
  });

  it('refetches when params change', async () => {
    const mockData = [{ id: 1 }];
    (getAppointments as jest.Mock).mockResolvedValue(mockData);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { rerender } = renderHook(
      (props: { start: string; end: string }) =>
        useAppointments({ start: props.start, end: props.end }),
      {
        wrapper,
        initialProps: { start: '2024-01-01', end: '2024-01-31' },
      }
    );

    await waitFor(() => expect(getAppointments).toHaveBeenCalledTimes(1));

    rerender({ start: '2024-02-01', end: '2024-02-28' });

    await waitFor(() => expect(getAppointments).toHaveBeenCalledTimes(2));
  });

  it('clears error when next call succeeds', async () => {
    (getAppointments as jest.Mock)
      .mockRejectedValueOnce(new Error('Error'))
      .mockResolvedValueOnce([{ id: 1 }]);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result, rerender } = renderHook(
      (props: { start: string; end: string }) =>
        useAppointments({ start: props.start, end: props.end }),
      {
        wrapper,
        initialProps: { start: '2024-01-01', end: '2024-01-31' },
      }
    );

    await waitFor(() => expect(result.current.error).toBeTruthy());

    rerender({ start: '2024-02-01', end: '2024-02-28' });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual([{ id: 1 }]);
    });
  });

  it('handles empty params gracefully', async () => {
    (getAppointments as jest.Mock).mockResolvedValue([]);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(() => useAppointments({ start: '', end: '' }), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual([]));
  });

  it('handles large datasets', async () => {
    const bigData = Array.from({ length: 500 }, (_, i) => ({ id: i }));
    (getAppointments as jest.Mock).mockResolvedValue(bigData);

    const client = createClient();
    const wrapper = wrapperFactory(client);

    const { result } = renderHook(
      () => useAppointments({ start: '2024-01-01', end: '2024-01-31' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.data?.length).toBe(500));
  });
});
