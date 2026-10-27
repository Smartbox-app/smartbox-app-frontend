import { useQuery } from '@tanstack/react-query';

import { BoxGroupUserRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const boxGroupsForStockQueryKey = (stockId: string) =>
  ['box-group-new', 'all', stockId] as const;

export const useBoxGroupsForStockQuery = (stockId?: string) =>
  useQuery({
    queryKey: stockId
      ? boxGroupsForStockQueryKey(stockId)
      : ['box-group-new', 'all', 'missing'],
    queryFn: () =>
      ApiService.callFetch<BoxGroupUserRes[]>(
        'GET',
        `box-group-new/all/${stockId}`,
      ),
    enabled: !!stockId,
    retry: false,
  });
