import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { MyRentList } from 'smartbox-types';

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
