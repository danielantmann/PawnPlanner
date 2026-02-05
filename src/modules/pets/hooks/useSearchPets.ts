import { useQuery } from '@tanstack/react-query';
import { searchPets } from '../api/pets.api';

export function useSearchPets(query: string) {
  return useQuery({
    queryKey: ['pets', query],
    queryFn: () => searchPets(query),
    enabled: query.length > 1,
  });
}
