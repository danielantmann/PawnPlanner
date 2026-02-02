import { useQuery } from '@tanstack/react-query';
import { getDashboardTodayApi } from '../api/dashboard.api';

export function useDashboardToday() {
  return useQuery({
    queryKey: ['dashboard-today'],
    queryFn: getDashboardTodayApi,
    staleTime: 1000 * 30, // 30 segundos
    refetchOnWindowFocus: true,
  });
}
