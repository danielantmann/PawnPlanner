import { create } from 'zustand';

interface DropdownStore {
  openDropdowns: Set<string>;
  openDropdown: (id: string) => void;
  closeDropdown: (id: string) => void;
  closeAllDropdowns: () => void;
  isDropdownOpen: (id: string) => boolean;
}

export const useDropdownStore = create<DropdownStore>((set, get) => ({
  openDropdowns: new Set(),

  // ⭐ ABRE UN DROPDOWN Y CIERRA LOS DEMÁS
  openDropdown: (id: string) => {
    set((state) => ({
      openDropdowns: new Set([id]), // ⭐ SOLO ESTE ID, CIERRA LOS DEMÁS
    }));
  },

  closeDropdown: (id: string) => {
    set((state) => {
      const next = new Set(state.openDropdowns);
      next.delete(id);
      return { openDropdowns: next };
    });
  },

  closeAllDropdowns: () => {
    set({ openDropdowns: new Set() });
  },

  isDropdownOpen: (id: string) => {
    return get().openDropdowns.has(id);
  },
}));
