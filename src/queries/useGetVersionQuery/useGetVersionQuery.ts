import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';

export const useGetVersionQuery = () => {
  return useQuery({
    queryKey: ['version'],
    queryFn: async () => {
      try {
        const response = await ApiService.callFetch<string>(
          'get',
          'settings/version',
          undefined,
          undefined,
          undefined,
          true,
        );

        if (response) return response;
        throw new Error('No version available');
      } catch (e) {
        console.log('CAUGHE E');
        throw e;
      }
    },
    retry: false,
    refetchInterval: 3000,
  });
};
