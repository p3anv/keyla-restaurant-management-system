import { useQuery } from '@tanstack/react-query';
import { menuApi, MenuCategory } from '@/api/endpoints/menu.api';

export const useMenu = () => {
  return useQuery({
    queryKey: ['menu'],
    queryFn: () => menuApi.getMenu().then((res) => res.data.categories),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};