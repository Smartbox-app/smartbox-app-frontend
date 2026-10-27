import { useQuery } from '@tanstack/react-query';

import { DiscountList } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const stockDiscountsQueryKey = () => ['stock', 'discounts'] as const;

export const useStockDiscountsQuery = () =>
  useQuery({
    queryKey: stockDiscountsQueryKey(),
    queryFn: () =>
      ApiService.callFetch<DiscountList[]>('GET', 'stock/discounts'),
    retry: false,
  });
