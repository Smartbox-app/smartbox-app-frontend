import { useQuery } from '@tanstack/react-query';

import { AlarmsStatusForAdminRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const alarmsStatusForStockQueryKey = (stockId: string) =>
  ['gate', 'alarm-status', 'stock', stockId] as const;

type UseAlarmsStatusForStockQueryOptions = {
  refetchInterval?: number | false;
};

export const useAlarmsStatusForStockQuery = (
  stockId?: string,
  { refetchInterval }: UseAlarmsStatusForStockQueryOptions = {},
) =>
  useQuery({
    queryKey: stockId
      ? alarmsStatusForStockQueryKey(stockId)
      : ['gate', 'alarm-status', 'stock', 'missing'],
    queryFn: () =>
      ApiService.callFetch<AlarmsStatusForAdminRes>(
        'GET',
        `gate/alarm-status/stock/${stockId}`,
      ),
    enabled: !!stockId,
    refetchInterval,
    retry: false,
  });
