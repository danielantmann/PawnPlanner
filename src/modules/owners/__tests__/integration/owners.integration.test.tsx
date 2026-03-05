import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateOwner } from '../../hooks/useCreateOwner';
import { useUpdateOwner } from '../../hooks/useUpdateOwner';
import { useDeleteOwner } from '../../hooks/useDeleteOwner';
import { useOwners } from '../../hooks/useOwners';
import { api } from '@/src/lib/axios';

jest.mock('@/src/lib/axios', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('@/src/i18n', () => ({
  t: (key: string) => key,
  default: { t: (key: string) => key },
}));

function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: true,
      },
      mutations: { retry: false },
    },
  });
}

function wrapper(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('Owners Integration Flow', () => {
  let client: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = createTestClient();
  });

  afterEach(() => {
    client.cancelQueries();
    client.clear();
    client.getQueryCache().clear();
  });

  it('creates owner without pet, updates and deletes', async () => {
    // 1) Lista inicial vacía
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const ownersList = renderHook(() => useOwners(), { wrapper: wrapper(client) });
    await waitFor(() => expect(ownersList.result.current.data).toEqual([]));

    // 2) Crear owner sin pet
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: { id: 1, name: 'Juan', phone: '612345678', email: null, pets: [] },
    });

    const create = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await create.result.current.mutateAsync({
        owner: { name: 'Juan', phone: '612345678' },
      });
    });

    // 3) Lista después de crear
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1, name: 'Juan', phone: '612345678', email: null, pets: [] }],
    });

    const ownersAfterCreate = renderHook(() => useOwners(), { wrapper: wrapper(client) });
    await waitFor(() => expect(ownersAfterCreate.result.current.data?.length).toBe(1));

    // 4) Actualizar owner
    (api.put as jest.Mock).mockResolvedValueOnce({
      data: { id: 1, name: 'Juan Updated', phone: '612345678', email: 'juan@test.com', pets: [] },
    });

    const update = renderHook(() => useUpdateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await update.result.current.mutateAsync({
        id: 1,
        payload: { name: 'Juan Updated', email: 'juan@test.com' },
      });
    });

    // 5) Lista después de actualizar
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [{ id: 1, name: 'Juan Updated', phone: '612345678', email: 'juan@test.com', pets: [] }],
    });

    const ownersAfterUpdate = renderHook(() => useOwners(), { wrapper: wrapper(client) });
    await waitFor(() =>
      expect(ownersAfterUpdate.result.current.data?.[0].name).toBe('Juan Updated')
    );

    // 6) Eliminar owner
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: {} });

    const remove = renderHook(() => useDeleteOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await remove.result.current.mutateAsync(1);
    });

    // 7) Lista vacía tras eliminar
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const ownersAfterDelete = renderHook(() => useOwners(), { wrapper: wrapper(client) });
    await waitFor(() => expect(ownersAfterDelete.result.current.data).toEqual([]));
  });

  it('creates owner with pet', async () => {
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 1,
        name: 'Juan',
        phone: '612345678',
        email: null,
        pets: [{ id: 1, name: 'Rocky' }],
      },
    });

    const create = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      await create.result.current.mutateAsync({
        owner: { name: 'Juan', phone: '612345678' },
        pet: { name: 'Rocky', breedId: 1, birthDate: '2020-01-01' },
      });
    });

    expect(api.post).toHaveBeenCalledWith(
      '/owners/with-pet',
      expect.objectContaining({
        owner: expect.objectContaining({ name: 'Juan' }),
        pet: expect.objectContaining({ name: 'Rocky', breedId: 1 }),
      })
    );
  });

  it('handles create error gracefully', async () => {
    (api.post as jest.Mock).mockRejectedValue(new Error('Server error'));

    const create = renderHook(() => useCreateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      try {
        await create.result.current.mutateAsync({
          owner: { name: 'Juan', phone: '612345678' },
        });
      } catch {}
    });

    await waitFor(() => expect(create.result.current.error).toBeTruthy());
  });

  it('handles update error gracefully', async () => {
    (api.put as jest.Mock).mockRejectedValue(new Error('Server error'));

    const update = renderHook(() => useUpdateOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      try {
        await update.result.current.mutateAsync({ id: 1, payload: { name: 'Juan' } });
      } catch {}
    });

    await waitFor(() => expect(update.result.current.error).toBeTruthy());
  });

  it('handles delete error gracefully', async () => {
    (api.delete as jest.Mock).mockRejectedValue(new Error('Server error'));

    const remove = renderHook(() => useDeleteOwner(), { wrapper: wrapper(client) });

    await act(async () => {
      try {
        await remove.result.current.mutateAsync(1);
      } catch {}
    });

    await waitFor(() => expect(remove.result.current.error).toBeTruthy());
  });
});
