import { useQuery } from '@tanstack/react-query';

import { StockRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const stockQueryKey = (stockId: string) =>
  ['stock', stockId] as const;

export const useGetStockQuery = (stockId?: string) =>
  useQuery({
    enabled: !!stockId,
    queryKey: stockId ? stockQueryKey(stockId) : ['stock', 'missing'],
    queryFn: () =>
      ApiService.callFetch<StockRes>('GET', `stock/${stockId}`),
    retry: false,
  });
