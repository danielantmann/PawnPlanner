import { useQuery } from '@tanstack/react-query';
import { getAnimals } from '../api/animals.api';

export function useGetAnimals() {
  return useQuery({
    queryKey: ['animals'],
    queryFn: getAnimals,
    staleTime: 1000 * 60 * 10, // 10 min, los animales casi nunca cambian
  });
}
