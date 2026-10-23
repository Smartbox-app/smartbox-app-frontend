import { useQuery } from '@tanstack/react-query';
import { PeriodConfiguration } from 'smartbox-types';
import ApiService from '../../services/api-service';

export const rentPeriodConfigQueryKey = (rentId: string) =>
  ['rent', 'period-config', rentId] as const;

export const useRentPeriodConfigQuery = (rentId?: string) =>
  useQuery({
    queryKey: rentId
      ? rentPeriodConfigQueryKey(rentId)
      : ['rent', 'period-config', 'missing'],
    queryFn: () =>
      ApiService.callFetch<PeriodConfiguration>(
        'GET',
        `rent/period-config/${rentId}`,
      ),
    enabled: !!rentId,
    retry: false,
  });
