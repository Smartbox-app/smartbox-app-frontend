import { useQuery } from '@tanstack/react-query';

import { StockOrderRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const stockForOrderQueryKey = (stockId: string) =>
  ['stock', 'order', stockId] as const;

export const useStockForOrderQuery = (stockId?: string) =>
  useQuery({
    enabled: !!stockId,
    queryKey: stockId
      ? stockForOrderQueryKey(stockId)
      : ['stock', 'order', 'missing'],
    queryFn: () =>
      ApiService.callFetch<StockOrderRes>('GET', `stock/order/${stockId}`),
    retry: false,
  });
