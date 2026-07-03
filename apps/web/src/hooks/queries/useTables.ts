import { useQuery } from '@tanstack/react-query';
import { tablesApi } from '@/api/endpoints/tables.api';

export const useTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tablesApi.getTables(),
    staleTime: 1000 * 10,
  });
};