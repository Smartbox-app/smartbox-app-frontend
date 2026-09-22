import { useQuery } from '@tanstack/react-query';
import { RentDetailsRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const rentDetailsQueryKey = (rentId: string) =>
  ['rent', 'details', rentId] as const;

export const useRentDetailsQuery = (rentId?: string) =>
  useQuery({
    enabled: !!rentId,
    queryKey: rentId ? rentDetailsQueryKey(rentId) : ['rent', 'details', 'missing'],
    queryFn: () =>
      ApiService.callFetch<RentDetailsRes>('GET', `rent/details/${rentId}`),
    retry: false,
  });
