import { useQuery } from '@tanstack/react-query';

import { DocumentHtmlRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const rentAgreementHtmlQueryKey = (
  rentId: string,
  periodIndex: number,
) => ['rent', 'agreement', 'html', rentId, periodIndex] as const;

export const useGetRentAgreementHtmlQuery = (
  rentId?: string,
  periodIndex?: number,
) => {
  const period = periodIndex ?? 0;

  return useQuery({
    enabled: !!rentId,
    queryKey: rentId
      ? rentAgreementHtmlQueryKey(rentId, period)
      : ['rent', 'agreement', 'html', 'missing'],
    queryFn: async () => {
      if (!rentId) return null;

      const response = await ApiService.callFetch<DocumentHtmlRes>(
        'GET',
        `rent/agreement/${rentId}/${period}/html`,
        undefined,
        undefined,
        undefined,
        false,
        true,
      );

      return response ?? null;
    },
    retry: false,
  });
};
