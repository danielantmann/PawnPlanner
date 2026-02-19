import { useQuery } from '@tanstack/react-query';
import { getWorkers } from '../api/workers.api';

export const useGetWorkers = () => {
  return useQuery({
    queryKey: ['workers'],
    queryFn: () => getWorkers(),
  });
};
