import { useQuery } from '@tanstack/react-query';
import { getAllOwners } from '../api/owners.api';

export function useOwners() {
  return useQuery({
    queryKey: ['owners'],
    queryFn: getAllOwners,
    staleTime: 1000 * 60 * 5, // 5 minutos, los owners cambian menos que las citas
  });
}
