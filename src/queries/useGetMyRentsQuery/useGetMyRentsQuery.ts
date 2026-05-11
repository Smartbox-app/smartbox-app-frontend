import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { MyRentList } from 'smartbox-types';

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
