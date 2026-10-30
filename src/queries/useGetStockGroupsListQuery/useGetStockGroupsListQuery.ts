import { useQuery } from '@tanstack/react-query';

import { StockGroupWithStocks } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const stockGroupsListQueryKey = ['stock-group', 'list'] as const;

export const useGetStockGroupsListQuery = (enabled = true) =>
  useQuery({
    queryKey: stockGroupsListQueryKey,
    queryFn: () =>
      ApiService.callFetch<StockGroupWithStocks[]>('GET', 'stock-group/list'),
    enabled,
    gcTime: 300000,
    retry: false,
  });
