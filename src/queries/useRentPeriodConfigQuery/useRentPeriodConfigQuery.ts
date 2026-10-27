import { useQuery } from '@tanstack/react-query';

import ApiService from 'src/services/api-service';

export type RentPeriodConfigRes = {
  min: number;
  max: number;
};

export const rentPeriodConfigQueryKey = (rentId: string) =>
  ['rent', 'period-config', rentId] as const;

export const useRentPeriodConfigQuery = (rentId?: string) =>
  useQuery({
    queryKey: rentId
      ? rentPeriodConfigQueryKey(rentId)
      : ['rent', 'period-config', 'missing'],
    queryFn: () =>
      ApiService.callFetch<RentPeriodConfigRes>(
        'GET',
        `rent/period-config/${rentId}`,
      ),
    enabled: !!rentId,
    retry: false,
  });
