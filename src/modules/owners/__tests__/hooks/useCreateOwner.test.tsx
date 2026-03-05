import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateOwner } from '../../hooks/useCreateOwner';
import { api } from '@/src/lib/axios';

jest.mock('@/src/lib/axios', () => ({
  api: { post: jest.fn() },
}));

function createClient() {
  return new QueryClient({ defaultOptions: { mutations: { retry: false } } });
}

function wrapper(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

const mockOwner = { id: 1, name: 'Juan', phone: '612345678', email: null, pets: [] };

describe('useCreateOwner', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates owner without pet', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const { result } = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({
        owner: { name: 'Juan', phone: '612345678' },
      });
    });

    expect(api.post).toHaveBeenCalledWith(
      '/owners/with-pet',
      expect.objectContaining({
        owner: expect.objectContaining({ name: 'Juan', phone: '612345678' }),
      })
    );
  });

  it('creates owner with pet', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const { result } = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({
        owner: { name: 'Juan', phone: '612345678' },
        pet: { name: 'Rocky', breedId: 1 },
      });
    });

    expect(api.post).toHaveBeenCalledWith(
      '/owners/with-pet',
      expect.objectContaining({
        pet: expect.objectContaining({ name: 'Rocky', breedId: 1 }),
      })
    );
  });

  it('normalizes email to null when empty', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const { result } = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({
        owner: { name: 'Juan', phone: '612345678', email: '' },
      });
    });

    expect(api.post).toHaveBeenCalledWith(
      '/owners/with-pet',
      expect.objectContaining({
        owner: expect.objectContaining({ email: null }),
      })
    );
  });

  it('trims phone whitespace', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const { result } = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({
        owner: { name: 'Juan', phone: '  612345678  ' },
      });
    });

    expect(api.post).toHaveBeenCalledWith(
      '/owners/with-pet',
      expect.objectContaining({
        owner: expect.objectContaining({ phone: '612345678' }),
      })
    );
  });

  it('invalidates owners query on success', async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: mockOwner });

    const client = createClient();
    const invalidateSpy = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await result.current.mutateAsync({ owner: { name: 'Juan', phone: '612345678' } });
    });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['owners'] });
  });

  it('exposes error on failure', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Network error'));

    const client = createClient();
    const { result } = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      try {
        await result.current.mutateAsync({ owner: { name: 'Juan', phone: '612345678' } });
      } catch {}
    });

    await waitFor(() => expect(result.current.error).toBeTruthy());
  });
});
