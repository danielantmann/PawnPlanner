import { useQuery } from '@tanstack/react-query';
import { getBreedsByAnimal } from '../api/breeds.api';

export function useGetBreedsByAnimal(animalId: number | null) {
  return useQuery({
    queryKey: ['breeds', 'animal', animalId],
    queryFn: () => getBreedsByAnimal(animalId!),
    enabled: animalId !== null,
    staleTime: 1000 * 60 * 10,
  });
}
