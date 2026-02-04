import { colors } from '@/src/ui/theme/colors';
import { AppointmentStatus } from '../types/appointment.types';

export const EVENT_COLORS: Record<AppointmentStatus, string> = {
  completed: colors.success,
  'no-show': colors.danger,
  cancelled: colors.danger,
};
