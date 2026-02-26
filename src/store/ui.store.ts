import { create } from 'zustand';

interface UIState {
  loading: boolean;
  setLoading: (value: boolean) => void;

  theme: 'light' | 'dark';
  setTheme: (theme: UIState['theme']) => void;

  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  loading: false,
  setLoading: (value) => set({ loading: value }),

  theme: 'light',
  setTheme: (theme) => set({ theme }),

  isDrawerOpen: false,
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
}));
