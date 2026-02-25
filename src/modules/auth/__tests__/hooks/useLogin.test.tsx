import { renderHook, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useLogin } from '../../hooks/useLogin';
import { loginApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { router } from 'expo-router';
import { AUTH_ERROR_MAP } from '../../errors/authErrors';

// Mocks
jest.mock('../../api/auth.api', () => ({
  loginApi: jest.fn(),
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

describe('useLogin', () => {
  const mockSetSession = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Zustand selector mock
    (useAuthStore as unknown as jest.Mock).mockReturnValue(mockSetSession);
  });

  it('logs in successfully and redirects', async () => {
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

    (loginApi as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        email: 'test@test.com',
        password: '123456',
      });
    });

    expect(loginApi).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
    });

    expect(mockSetSession).toHaveBeenCalledWith('access123', 'refresh123', mockResponse.user);

    expect(router.replace).toHaveBeenCalledWith('/(protected)/(tabs)/home');
  });

  it('maps backend error messages using AUTH_ERROR_MAP', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    (loginApi as jest.Mock).mockRejectedValue({
      response: {
        data: { message: 'invalid.credentials' },
      },
    });

    const { result } = renderHook(() => useLogin(), { wrapper });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: 'wrong@test.com',
          password: 'badpass',
        });
      })
    ).rejects.toThrow(AUTH_ERROR_MAP['invalid.credentials']);
  });

  it('throws generic error when backend message is unknown', async () => {
    const client = createTestClient();
    const wrapper = wrapperFactory(client);

    (loginApi as jest.Mock).mockRejectedValue({
      response: {
        data: { message: 'unknown.error' },
      },
    });

    const { result } = renderHook(() => useLogin(), { wrapper });

    await expect(
      act(async () => {
        await result.current.mutateAsync({
          email: 'test@test.com',
          password: '123456',
        });
      })
    ).rejects.toThrow('auth.unexpected');
  });
});
