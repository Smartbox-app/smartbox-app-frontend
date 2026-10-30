import { useQuery } from '@tanstack/react-query';

import { BoxMapRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const stockBoxesQueryKey = (stockId: string) => {
  return ['stock', stockId, 'boxes'] as const;
};

export const useGetStockBoxesQuery = (stockId?: string) =>
  useQuery({
    queryKey: stockId
      ? stockBoxesQueryKey(stockId)
      : ['stock', 'missing', 'boxes'],
    queryFn: () =>
      ApiService.callFetch<BoxMapRes[]>('GET', `box/all/${stockId}`),
    retry: false,
  });
