import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateOwner } from '../../hooks/useUpdateOwner';
import { api } from '@/src/lib/axios';

jest.mock('@/src/lib/axios', () => ({
  api: { put: jest.fn() },
}));

function createClient() {
  return new QueryClient({ defaultOptions: { mutations: { retry: false } } });
}

function wrapper(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

const mockOwner = { id: 1, name: 'Juan Updated', phone: '612345678', email: null, pets: [] };

describe('useUpdateOwner', () => {
  beforeEach(() => jest.clearAllMocks());

  it('updates owner', async () => {
    (api.put as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const { result } = renderHook(() => useUpdateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({ id: 1, payload: { name: 'Juan Updated' } });
    });

    expect(api.put).toHaveBeenCalledWith(
      '/owners/1',
      expect.objectContaining({ name: 'Juan Updated' })
    );
  });

  it('normalizes email to null when empty', async () => {
    (api.put as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const { result } = renderHook(() => useUpdateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({ id: 1, payload: { email: '' } });
    });

    expect(api.put).toHaveBeenCalledWith('/owners/1', expect.objectContaining({ email: null }));
  });

  it('trims phone whitespace', async () => {
    (api.put as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const { result } = renderHook(() => useUpdateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({ id: 1, payload: { phone: '  612345678  ' } });
    });

    expect(api.put).toHaveBeenCalledWith(
      '/owners/1',
      expect.objectContaining({ phone: '612345678' })
    );
  });

  it('invalidates owners and owner by id queries on success', async () => {
    (api.put as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({ id: 1, payload: { name: 'Juan Updated' } });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['owners'] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['owners', 1] });
  });

  it('exposes error on failure', async () => {
    (api.put as jest.Mock).mockRejectedValue(new Error('Network error'));

    const client = createClient();
    const { result } = renderHook(() => useUpdateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      try {
        await result.current.mutateAsync({ id: 1, payload: { name: 'Juan' } });
      } catch {}
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
