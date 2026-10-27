import { useQuery } from '@tanstack/react-query';

import { MyRentList } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const useGetMyAuthorizedRentsQuery = () => {
  return useQuery({
    queryKey: ['my-authorized-rents'],
    queryFn: async () => {
      const res = await ApiService.callFetch<MyRentList[]>(
        'GET',
        'rent/me-authorized',
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
