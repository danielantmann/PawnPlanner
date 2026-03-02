import { useQuery } from '@tanstack/react-query';
import { searchOwnersByName } from '../api/owners.api';

export function useSearchOwners(query: string) {
  return useQuery({
    queryKey: ['owners', 'search', query],
    queryFn: () => searchOwnersByName(query),
    enabled: query.length > 1,
    staleTime: 1000 * 30,
  });
}
