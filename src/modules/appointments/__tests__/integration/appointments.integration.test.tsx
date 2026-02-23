import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useCreateAppointment } from '../../hooks/useCreateAppointment';
import { useUpdateAppointment } from '../../hooks/useUpdateAppointment';
import { useDeleteAppointment } from '../../hooks/useDeleteAppointment';
import { useHomeAppointments } from '../../hooks/useHomeAppointments';

import { api } from '@/src/lib/axios';

// Mock SOLO de tu instancia api
jest.mock('@/src/lib/axios', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0, // fuerza re-fetch
        gcTime: Infinity, // evita timers internos
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: true, // re-fetch al montar
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function wrapper(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('Appointments Integration Flow', () => {
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

  it('creates, updates, deletes an appointment and updates home list', async () => {
    // 1) HOME INICIAL — sin citas
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const homeInitial = renderHook(() => useHomeAppointments(), {
      wrapper: wrapper(client),
    });

    expect(homeInitial.result.current.mappedAppointments).toEqual([]);

    // 2) CREAR CITA
    (api.post as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 1,
        petName: 'Luna',
        ownerName: 'Carlos',
        serviceName: 'Baño',
        startTime: new Date().toISOString(),
        status: 'completed',
      },
    });

    const create = renderHook(() => useCreateAppointment(), {
      wrapper: wrapper(client),
    });

    await act(async () => {
      await create.result.current.mutateAsync({
        petId: 1,
        serviceId: 2,
        startTime: '10:00',
        endTime: '11:00',
      });
    });

    // 3) HOME DESPUÉS DE CREAR — esperar re-fetch
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          petName: 'Luna',
          ownerName: 'Carlos',
          serviceName: 'Baño',
          startTime: new Date().toISOString(),
          status: 'completed',
        },
      ],
    });

    const homeAfterCreate = renderHook(() => useHomeAppointments(), {
      wrapper: wrapper(client),
    });

    await waitFor(() => expect(homeAfterCreate.result.current.mappedAppointments.length).toBe(1));

    // 4) EDITAR CITA
    (api.put as jest.Mock).mockResolvedValueOnce({
      data: {
        id: 1,
        petName: 'Luna',
        ownerName: 'Carlos',
        serviceName: 'Corte',
        startTime: new Date().toISOString(),
        status: 'completed',
      },
    });

    const update = renderHook(() => useUpdateAppointment(), {
      wrapper: wrapper(client),
    });

    await act(async () => {
      await update.result.current.mutateAsync({
        id: 1,
        data: { serviceId: 3 },
      });
    });

    // 5) HOME DESPUÉS DE EDITAR — esperar re-fetch
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          petName: 'Luna',
          ownerName: 'Carlos',
          serviceName: 'Corte',
          startTime: new Date().toISOString(),
          status: 'completed',
        },
      ],
    });

    const homeAfterUpdate = renderHook(() => useHomeAppointments(), {
      wrapper: wrapper(client),
    });

    await waitFor(() =>
      expect(homeAfterUpdate.result.current.mappedAppointments[0].serviceName).toBe('Corte')
    );

    // 6) ELIMINAR CITA
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: {} });

    const remove = renderHook(() => useDeleteAppointment(), {
      wrapper: wrapper(client),
    });

    await act(async () => {
      await remove.result.current.mutateAsync(1);
    });

    // 7) HOME DESPUÉS DE ELIMINAR — esperar re-fetch
    (api.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    const homeAfterDelete = renderHook(() => useHomeAppointments(), {
      wrapper: wrapper(client),
    });

    await waitFor(() => expect(homeAfterDelete.result.current.mappedAppointments).toEqual([]));
  });
});
