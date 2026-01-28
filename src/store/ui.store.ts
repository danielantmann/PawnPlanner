import { create } from 'zustand';

interface UIState {
  loading: boolean;
  setLoading: (value: boolean) => void;

  theme: 'light' | 'dark';
  setTheme: (theme: UIState['theme']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),

  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));
