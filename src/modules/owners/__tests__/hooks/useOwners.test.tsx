import { renderHook, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOwners } from '../../hooks/useOwners';
import { getAllOwners } from '../../api/owners.api';

jest.mock('../../api/owners.api', () => ({
  getAllOwners: jest.fn(),
}));

beforeAll(() => jest.useFakeTimers());
afterAll(() => jest.useRealTimers());

function createClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function wrapper(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useOwners', () => {
  afterEach(() => {
    jest.clearAllMocks();
    act(() => {
      jest.runOnlyPendingTimers();
    });
  });

  it('fetches all owners', async () => {
    const mockData = [{ id: 1, name: 'Juan', phone: '612345678', email: null, pets: [] }];
    (getAllOwners as jest.Mock).mockResolvedValue(mockData);

    const client = createClient();
    const { result } = renderHook(() => useOwners(), { wrapper: wrapper(client) });

    await waitFor(() => expect(result.current.data).toEqual(mockData));
  });

  it('exposes loading state', () => {
    (getAllOwners as jest.Mock).mockReturnValue(new Promise(() => {}));

    const client = createClient();
    const { result } = renderHook(() => useOwners(), { wrapper: wrapper(client) });

    expect(result.current.isLoading).toBe(true);
  });

  it('exposes error state', async () => {
    (getAllOwners as jest.Mock).mockRejectedValue(new Error('Error'));

    const client = createClient();
    const { result } = renderHook(() => useOwners(), { wrapper: wrapper(client) });

    await waitFor(() => expect(result.current.error).toBeTruthy());
  });

  it('caches results', async () => {
    (getAllOwners as jest.Mock).mockResolvedValue([]);

    const client = createClient();
    const w = wrapper(client);

    renderHook(() => useOwners(), { wrapper: w });
    await waitFor(() => expect(getAllOwners).toHaveBeenCalledTimes(1));

    renderHook(() => useOwners(), { wrapper: w });
    expect(getAllOwners).toHaveBeenCalledTimes(1);
  });

  it('handles empty list', async () => {
    (getAllOwners as jest.Mock).mockResolvedValue([]);

    const client = createClient();
    const { result } = renderHook(() => useOwners(), { wrapper: wrapper(client) });

    await waitFor(() => expect(result.current.data).toEqual([]));
  });
});
