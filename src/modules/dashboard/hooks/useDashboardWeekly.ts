import { useQuery } from '@tanstack/react-query';
import { getDashboardWeeklyApi } from '../api/dashboard.api';

export function useDashboardWeekly() {
  return useQuery({
    queryKey: ['dashboard-weekly'],
    queryFn: getDashboardWeeklyApi,
    staleTime: 1000 * 30, // 30 segundos
    refetchOnWindowFocus: true,
  });
}
