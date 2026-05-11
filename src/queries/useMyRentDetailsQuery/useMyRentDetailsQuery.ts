import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { MyRentDetails } from 'smartbox-types';

export const myRentDetailsQueryKey = (rentId: string) =>
  ['rent', 'my-details', rentId] as const;

export const useMyRentDetailsQuery = (
  rentId?: string,
) => {
  return useQuery({
    enabled: !!rentId,
    queryKey: ['rent', 'my-details', rentId],
    queryFn: async () => {
      const res = await ApiService.callFetch<MyRentDetails>(
        'GET',
        `rent/my-details/${rentId}`,
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
