import { create } from 'zustand';

type ViewMode = 'day' | 'week' | 'month' | '3days';

interface SelectedAppointment {
  id: number;
  petId: number;
  serviceId: number;
  petName: string;
  ownerName: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'no-show' | 'cancelled';
  finalPrice?: number;
}

interface AgendaState {
  // UI State
  viewMode: ViewMode;
  selectedDate: Date;

  // Modal State
  createModalVisible: boolean;
  editModalVisible: boolean;
  deleteModalVisible: boolean;
  selectedAppointment: SelectedAppointment | null;

  // Time range (for day view)
  startHour: number;
  endHour: number;

  // Selected time from calendar
  selectedHour: number | null;
  selectedMinute: number | null;

  // Actions
  setViewMode: (mode: ViewMode) => void;
  setSelectedDate: (date: Date) => void;

  openCreateModal: () => void;
  closeCreateModal: () => void;

  openEditModal: (appointment: SelectedAppointment) => void;
  closeEditModal: () => void;

  openDeleteModal: (appointment: SelectedAppointment) => void;
  closeDeleteModal: () => void;

  setTimeRange: (start: number, end: number) => void;

  setSelectedHour: (hour: number | null) => void;
  setSelectedMinute: (minute: number | null) => void;
}

export const useAgendaStore = create<AgendaState>((set) => ({
  // Initial State
  viewMode: 'day',
  selectedDate: new Date(),

  createModalVisible: false,
  editModalVisible: false,
  deleteModalVisible: false,
  selectedAppointment: null,

  startHour: 8,
  endHour: 22,

  // Selected time from calendar
  selectedHour: null,
  selectedMinute: null,

  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedDate: (date) => set({ selectedDate: date }),

  openCreateModal: () => set({ createModalVisible: true }),
  closeCreateModal: () =>
    set({
      createModalVisible: false,
      selectedHour: null,
      selectedMinute: null,
    }),

  openEditModal: (appointment) => set({ editModalVisible: true, selectedAppointment: appointment }),
  closeEditModal: () => set({ editModalVisible: false, selectedAppointment: null }),

  openDeleteModal: (appointment) =>
    set({ deleteModalVisible: true, selectedAppointment: appointment }),
  closeDeleteModal: () => set({ deleteModalVisible: false, selectedAppointment: null }),

  setTimeRange: (start, end) => set({ startHour: start, endHour: end }),

  setSelectedHour: (hour) => set({ selectedHour: hour }),
  setSelectedMinute: (minute) => set({ selectedMinute: minute }),
}));
