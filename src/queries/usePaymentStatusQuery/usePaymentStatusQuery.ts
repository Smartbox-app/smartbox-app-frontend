import { useQuery } from '@tanstack/react-query';

import { PaymentStatus } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const paymentStatusQueryKey = (id: string) =>
  ['payment', 'status', id] as const;

type UsePaymentStatusQueryOptions = {
  enabled?: boolean;
  refetchInterval?: number | false;
};

export const usePaymentStatusQuery = (
  id?: string,
  { enabled = true, refetchInterval }: UsePaymentStatusQueryOptions = {},
) =>
  useQuery({
    queryKey: id ? paymentStatusQueryKey(id) : ['payment', 'status', 'missing'],
    queryFn: () =>
      ApiService.callFetch<PaymentStatus>(
        'GET',
        `payment/${id}`,
        undefined,
        undefined,
        undefined,
        true,
        true,
      ),
    enabled: !!id && enabled,
    refetchInterval,
    retry: false,
  });
