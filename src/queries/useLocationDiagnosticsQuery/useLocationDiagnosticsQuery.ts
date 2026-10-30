import { useQuery } from '@tanstack/react-query';

import { LocationDiagnosticsRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const locationDiagnosticsQueryKey = (stockId: string) =>
  ['gate', 'diagnostics', 'stock', stockId] as const;

type UseLocationDiagnosticsQueryOptions = {
  refetchInterval?: number | false;
};

export const useLocationDiagnosticsQuery = (
  stockId?: string,
  { refetchInterval }: UseLocationDiagnosticsQueryOptions = {},
) =>
  useQuery({
    queryKey: stockId
      ? locationDiagnosticsQueryKey(stockId)
      : ['gate', 'diagnostics', 'stock', 'missing'],
    queryFn: () =>
      ApiService.callFetch<LocationDiagnosticsRes>(
        'GET',
        `gate/diagnostics/stock/${stockId}`,
      ),
    enabled: !!stockId,
    refetchInterval,
    retry: false,
  });
