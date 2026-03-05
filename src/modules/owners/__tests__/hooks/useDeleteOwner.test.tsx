import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteOwner } from '../../hooks/useDeleteOwner';
import { api } from '@/src/lib/axios';

jest.mock('@/src/lib/axios', () => ({
  api: { delete: jest.fn() },
}));

function createClient() {
  return new QueryClient({ defaultOptions: { mutations: { retry: false } } });
}

function wrapper(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useDeleteOwner', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deletes owner by id', async () => {
    (api.delete as jest.Mock).mockResolvedValue({ data: {} });

    const client = createClient();
    const { result } = renderHook(() => useDeleteOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync(1);
    });

    expect(api.delete).toHaveBeenCalledWith('/owners/1');
  });

  it('invalidates owners query on success', async () => {
    (api.delete as jest.Mock).mockResolvedValue({ data: {} });

    const client = createClient();
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => useDeleteOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync(1);
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['owners'] });
  });

  it('exposes error on failure', async () => {
    (api.delete as jest.Mock).mockRejectedValue(new Error('Network error'));

    const client = createClient();
    const { result } = renderHook(() => useDeleteOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      try {
        await result.current.mutateAsync(1);
      } catch {}
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
