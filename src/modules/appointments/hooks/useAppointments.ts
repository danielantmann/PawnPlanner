import { useQuery } from '@tanstack/react-query';
import { getAppointments } from '../api/appointments.api';

type UseAppointmentsParams = {
  start: string;
  end: string;
};

export function useAppointments({ start, end }: UseAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', start, end],
    queryFn: () => getAppointments({ start, end }),
    staleTime: 1000 * 30, // 30 segundos
    refetchOnWindowFocus: true,
  });
}
