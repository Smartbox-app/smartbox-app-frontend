import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { StockList } from 'smartbox-types';

export type InviteStockOption = { label: string; value: string };

export const useGetInviteStockOptionsQuery = (enabled = true) =>
  useQuery({
    queryKey: ['invite', 'stock-options'],
    queryFn: async () => {
      const stocks = await ApiService.callFetch<StockList[]>(
        'GET',
        'stock/list',
      );

      return (stocks ?? []).map(
        (stock): InviteStockOption => ({
          label: stock.name,
          value: stock.id,
        }),
      );
    },
    enabled,
    gcTime: 300000,
    retry: false,
  });
