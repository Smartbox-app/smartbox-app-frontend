import { useQuery } from '@tanstack/react-query';

import { GatesStatusForAdminRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const gatesStatusForStockQueryKey = (stockId: string) =>
  ['gate', 'status', 'stock', stockId] as const;

type UseGatesStatusForStockQueryOptions = {
  refetchInterval?: number | false;
};

export const useGatesStatusForStockQuery = (
  stockId?: string,
  { refetchInterval }: UseGatesStatusForStockQueryOptions = {},
) =>
  useQuery({
    queryKey: stockId
      ? gatesStatusForStockQueryKey(stockId)
      : ['gate', 'status', 'stock', 'missing'],
    queryFn: () =>
      ApiService.callFetch<GatesStatusForAdminRes>(
        'GET',
        `gate/status/stock/${stockId}`,
      ),
    enabled: !!stockId,
    refetchInterval,
    retry: false,
  });
