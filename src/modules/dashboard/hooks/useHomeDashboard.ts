import { useDashboardToday } from '@/src/modules/dashboard/hooks/useDashboardToday';
import { useDashboardWeekly } from '@/src/modules/dashboard/hooks/useDashboardWeekly';

export function useHomeDashboard() {
  const { data: todayStats, isLoading: loadingToday, error: errorToday } = useDashboardToday();

  const { data: weeklyStats, isLoading: loadingWeekly, error: errorWeekly } = useDashboardWeekly();

  const isLoading = loadingToday || loadingWeekly;
  const hasError = errorToday || errorWeekly;

  return {
    todayStats,
    loadingToday,
    weeklyStats,
    loadingWeekly,
    isLoading,
    hasError,
  };
}
