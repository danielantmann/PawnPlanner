import { useQuery } from '@tanstack/react-query';
import { getOwnerById } from '../api/owners.api';

export function useOwnerById(id: number) {
  return useQuery({
    queryKey: ['owners', id],
    queryFn: () => getOwnerById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });
}
