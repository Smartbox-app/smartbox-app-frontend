import { useQuery } from '@tanstack/react-query';

import { LocationActivityListItem } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const locationActivityQueryKey = (stockId: string) =>
  ['location-activity', stockId] as const;

export const useLocationActivityQuery = (stockId?: string) =>
  useQuery({
    enabled: !!stockId,
    queryKey: stockId
      ? locationActivityQueryKey(stockId)
      : ['location-activity', 'missing'],
    queryFn: () =>
      ApiService.callFetch<LocationActivityListItem[]>(
        'GET',
        `location-activity/stock/${stockId}`,
      ),
    refetchInterval: 10000,
    retry: false,
  });
