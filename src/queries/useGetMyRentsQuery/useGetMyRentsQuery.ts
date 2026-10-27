import { useQuery } from '@tanstack/react-query';

import { MyRentList } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const useGetMyRentsQuery = () => {
  return useQuery({
    queryKey: ['my-rents'],
    queryFn: async () => {
      const res = await ApiService.callFetch<MyRentList[]>(
        'GET',
        'rent/me-list',
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );
      return res;
    },
    retry: false,
  });
};
