import { act } from '@testing-library/react-native';
import { useAuthStore } from '../../store/auth.store';
import { refreshTokenApi } from '../../api/refresh.api';
import * as SecureStore from 'expo-secure-store';
import { tokenManager } from '../../token.manager';

// Mock User completo (cumple el tipo User)
const mockUser = {
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@test.com',
};

// Mocks
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../api/refresh.api', () => ({
  refreshTokenApi: jest.fn(),
}));

jest.mock('../../token.manager', () => ({
  tokenManager: {
    setTokens: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset Zustand state
    const { setState } = useAuthStore;
    setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoadingSession: true,
    });

    jest.clearAllMocks();
  });

  it('sets session correctly', async () => {
    const { setSession } = useAuthStore.getState();

    await act(async () => {
      setSession('access123', 'refresh123', mockUser);
    });

    const state = useAuthStore.getState();

    expect(state.accessToken).toBe('access123');
    expect(state.refreshToken).toBe('refresh123');
    expect(state.user?.email).toBe('test@test.com');
    expect(state.isAuthenticated).toBe(true);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refresh_token', 'refresh123');
    expect(tokenManager.setTokens).toHaveBeenCalledWith('access123', 'refresh123');
  });

  it('loads session successfully (refresh OK)', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('refresh123');

    (refreshTokenApi as jest.Mock).mockResolvedValue({
      accessToken: 'newAccess',
      refreshToken: 'newRefresh',
      user: mockUser,
    });

    const { loadSession } = useAuthStore.getState();

    await act(async () => {
      await loadSession();
    });

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(true);
    expect(state.accessToken).toBe('newAccess');
    expect(state.refreshToken).toBe('newRefresh');
    expect(state.user?.email).toBe('test@test.com');

    expect(tokenManager.setTokens).toHaveBeenCalled();
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('refresh_token', 'newRefresh');
  });

  it('clears session when refresh fails', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('refresh123');
    (refreshTokenApi as jest.Mock).mockRejectedValue(new Error('expired'));

    const { loadSession } = useAuthStore.getState();

    await act(async () => {
      await loadSession();
    });

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBe(null);
    expect(state.refreshToken).toBe(null);
    expect(state.user).toBe(null);

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token');
    expect(tokenManager.clear).toHaveBeenCalled();
  });

  it('logout clears everything', async () => {
    const { logout, setSession } = useAuthStore.getState();

    await act(async () => {
      setSession('a', 'b', mockUser);
    });

    await act(async () => {
      await logout();
    });

    const state = useAuthStore.getState();

    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBe(null);
    expect(state.refreshToken).toBe(null);
    expect(state.user).toBe(null);

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('refresh_token');
    expect(tokenManager.clear).toHaveBeenCalled();
  });
});
