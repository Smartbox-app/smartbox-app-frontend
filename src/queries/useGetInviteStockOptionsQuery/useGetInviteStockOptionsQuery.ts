import { useQuery } from '@tanstack/react-query';

import {
  fetchStockList,
  stockListQueryKey,
} from 'src/queries/useGetStockListQuery/useGetStockListQuery';

export type InviteStockOption = { label: string; value: string };

export const useGetInviteStockOptionsQuery = (enabled = true) =>
  useQuery({
    queryKey: stockListQueryKey,
    queryFn: fetchStockList,
    select: (stocks) =>
      (stocks ?? []).map(
        (stock): InviteStockOption => ({
          label: stock.name,
          value: stock.id,
        }),
      ),
    enabled,
    gcTime: 300000,
    retry: false,
  });
