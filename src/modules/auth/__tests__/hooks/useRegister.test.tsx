import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useRegister } from '../../hooks/useRegister';
import { registerApi } from '../../api/auth.api';
import { createWorkerApi } from '../../../workers/api/workers.api';
import { useAuthStore } from '../../store/auth.store';
import { router } from 'expo-router';

// Mocks
jest.mock('../../api/auth.api', () => ({
  registerApi: jest.fn(),
}));

jest.mock('../../../workers/api/workers.api', () => ({
  createWorkerApi: jest.fn(),
}));

jest.mock('../../store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
}));

// ⭐ Igual que en appointments
function createTestClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function wrapperFactory(client: QueryClient) {
  return ({ children }: any) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

describe('useRegister', () => {
  const mockSetSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Zustand selector mock
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockSetSession);
  });

  it('registers successfully, creates worker, sets session and redirects', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    const mockResponse = {
      accessToken: 'access123',
      refreshToken: 'refresh123',
      user: {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
      },
    };

    (registerApi as jest.Mock).mockResolvedValue(mockResponse);
    (createWorkerApi as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        password: '123456',
      });
    });

    expect(registerApi).toHaveBeenCalledWith({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      password: '123456',
    });

    expect(mockSetSession).toHaveBeenCalledWith('access123', 'refresh123', mockResponse.user);

    expect(createWorkerApi).toHaveBeenCalledWith({
      name: 'Test User',
    });

    expect(router.replace).toHaveBeenCalledWith('/(protected)/(tabs)/home');
  });

  it('logs backend errors but does not crash', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    (registerApi as jest.Mock).mockRejectedValue({
      response: {
        data: {
          errors: [
            {
              field: 'email',
              constraints: { isEmail: 'Invalid email' },
            },
          ],
        },
      },
    });

    const { result } = renderHook(() => useRegister(), { wrapper });

    await act(async () => {
      await result.current
        .mutateAsync({
          firstName: 'Test',
          lastName: 'User',
          email: 'bademail',
          password: '123456',
        })
        .catch(() => {});
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
