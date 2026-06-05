import { useQuery } from '@tanstack/react-query';
import { StockStatistics } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const stockStatisticsQueryKey = (stockId: string) =>
  ['stock', stockId, 'statistics'] as const;

export const useGetStockStatisticsQuery = (stockId?: string) =>
  useQuery({
    enabled: !!stockId,
    queryKey: stockId
      ? stockStatisticsQueryKey(stockId)
      : ['stock', 'missing', 'statistics'],
    queryFn: () =>
      ApiService.callFetch<StockStatistics>(
        'GET',
        `stock/${stockId}/statistics`,
      ),
    retry: false,
  });
