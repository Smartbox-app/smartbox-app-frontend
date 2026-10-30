import { useQuery } from '@tanstack/react-query';

import { SelectOption, UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries/useGetMyDetailsQuery';
import ApiService from 'src/services/api-service';

export type StockSelectOption = { label: string; value: string };

export const useGetStockOptionsQuery = (
  tenantId?: string | null,
  enabled = true,
) => {
  const { data: user } = useGetMyDetailsQuery();
  const isAdmin = user?.role === UserRole.admin;
  const canFetch = Boolean(enabled && user && (!isAdmin || tenantId));

  return useQuery({
    queryKey: ['stock', 'options', isAdmin ? tenantId : 'session'],
    queryFn: async () => {
      const path = isAdmin ? `stock/options/${tenantId}` : 'stock/options';
      const stocks = await ApiService.callFetch<SelectOption[]>(
        'GET',
        path,
      );

      return (stocks ?? []).map(
        (stock): StockSelectOption => ({
          label: stock.name.toString(),
          value: stock.value.toString(),
        }),
      );
    },
    enabled: canFetch,
    gcTime: 300000,
    retry: false,
  });
};
