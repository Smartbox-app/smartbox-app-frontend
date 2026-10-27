import { useQuery } from '@tanstack/react-query';

import { KsmGateOpenRequestRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const ksmGateStatusQueryKey = (requestId: string) =>
  ['ksm-gate', 'status', requestId] as const;

type UseKsmGateStatusQueryOptions = {
  refetchInterval?: number | false;
  enabled?: boolean;
};

export const useKsmGateStatusQuery = (
  requestId?: string,
  { refetchInterval, enabled = true }: UseKsmGateStatusQueryOptions = {},
) =>
  useQuery({
    queryKey: requestId
      ? ksmGateStatusQueryKey(requestId)
      : ['ksm-gate', 'status', 'missing'],
    queryFn: () =>
      ApiService.callFetch<KsmGateOpenRequestRes>(
        'GET',
        `v2/stock/ksm/open-gate/${requestId}`,
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      ),
    enabled: !!requestId && enabled,
    refetchInterval,
    retry: false,
  });
