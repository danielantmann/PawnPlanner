import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { refreshTokenApi } from '../api/auth.api';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  isAuthenticated: boolean;

  setSession: (accessToken: string, refreshToken: string, user: any) => Promise<void>;
  loadSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setSession: async (accessToken, refreshToken, user) => {
    await SecureStore.setItemAsync('refresh_token', refreshToken);

    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
    });
  },

  loadSession: async () => {
    const storedRefresh = await SecureStore.getItemAsync('refresh_token');

    if (!storedRefresh) {
      return;
    }

    try {
      const data = await refreshTokenApi(storedRefresh);

      set({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
        isAuthenticated: true,
      });

      await SecureStore.setItemAsync('refresh_token', data.refreshToken);
    } catch (err) {
      await SecureStore.deleteItemAsync('refresh_token');

      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('refresh_token');

    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
}));
