import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { refreshTokenApi } from '../api/refresh.api';
import { tokenManager } from '../token.manager';
import type { User, AuthResponse } from '../types/auth.types';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;

  setSession: (accessToken: string, refreshToken: string, user: User) => void;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoadingSession: true,

  setSession: (accessToken, refreshToken, user) => {
    tokenManager.setTokens(accessToken, refreshToken);

    SecureStore.setItemAsync('refresh_token', refreshToken).catch((err) => {
      console.error('Failed to save refresh token to SecureStore:', err);
    });

    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  loadSession: async () => {
    set({ isLoadingSession: true });

    try {
      const storedRefresh = await SecureStore.getItemAsync('refresh_token');

      if (!storedRefresh) {
        set({ isLoadingSession: false, isAuthenticated: false });
        return;
      }

      const data: AuthResponse = await refreshTokenApi(storedRefresh);

      tokenManager.setTokens(data.accessToken, data.refreshToken);
      await SecureStore.setItemAsync('refresh_token', data.refreshToken);

      set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        isAuthenticated: true,
        isLoadingSession: false,
      });
    } catch {
      // Token expirado o inválido - desloguear automáticamente
      await SecureStore.deleteItemAsync('refresh_token');
      tokenManager.clear();

      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isLoadingSession: false,
      });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('refresh_token');
    tokenManager.clear();

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
