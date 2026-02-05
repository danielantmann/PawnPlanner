import { useQuery } from '@tanstack/react-query';
import { getServices } from '../api/services.api';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: 1000 * 60 * 5, // cache 5 min
  });
}
