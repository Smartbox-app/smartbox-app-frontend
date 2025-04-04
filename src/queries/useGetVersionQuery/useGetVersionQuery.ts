import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';

export const useGetVersionQuery = () => {
  return useQuery({
    queryKey: ['version'],
    queryFn: async () => {
      const response = await ApiService.callFetch<string>(
        'get',
        'settings/version',
      );

      if (response) return response;
      return null;
    },
    refetchInterval: 3000,
  });
};
