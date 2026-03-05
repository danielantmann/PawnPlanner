import { create } from 'zustand';
import type { OwnerDTO } from '../types/owner.types';

interface OwnerState {
  // Modal state
  createModalVisible: boolean;
  editModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedOwner: OwnerDTO | null;

  // Actions
  openCreateModal: () => void;
  closeCreateModal: () => void;

  openEditModal: (owner: OwnerDTO) => void;
  closeEditModal: () => void;

  openDeleteModal: (owner: OwnerDTO) => void;
  closeDeleteModal: () => void;
}

export const useOwnerStore = create<OwnerState>((set) => ({
  createModalVisible: false,
  editModalVisible: false,
  deleteModalVisible: false,
  selectedOwner: null,

  openCreateModal: () => set({ createModalVisible: true }),
  closeCreateModal: () => set({ createModalVisible: false }),

  openEditModal: (owner) => set({ editModalVisible: true, selectedOwner: owner }),
  closeEditModal: () => set({ editModalVisible: false, selectedOwner: null }),

  openDeleteModal: (owner) => set({ deleteModalVisible: true, selectedOwner: owner }),
  closeDeleteModal: () => set({ deleteModalVisible: false, selectedOwner: null }),
}));
