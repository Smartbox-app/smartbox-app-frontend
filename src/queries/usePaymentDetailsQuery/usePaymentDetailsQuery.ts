import { useQuery } from '@tanstack/react-query';
import { PaymentDetails } from 'smartbox-types';
import ApiService from '../../services/api-service';

export const paymentDetailsQueryKey = (id: string) =>
  ['payment', 'details', id] as const;

type UsePaymentDetailsQueryOptions = {
  enabled?: boolean;
  refetchInterval?: number | false;
};

export const usePaymentDetailsQuery = (
  id?: string,
  { enabled = true, refetchInterval }: UsePaymentDetailsQueryOptions = {},
) =>
  useQuery({
    queryKey: id
      ? paymentDetailsQueryKey(id)
      : ['payment', 'details', 'missing'],
    queryFn: () =>
      ApiService.callFetch<PaymentDetails>(
        'GET',
        `payment/details/${id}`,
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
