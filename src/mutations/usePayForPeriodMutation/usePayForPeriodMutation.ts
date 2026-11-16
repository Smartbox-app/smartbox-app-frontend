import { Capacitor } from '@capacitor/core';
import { useMutation } from '@tanstack/react-query';

import { PayForRentResponse } from 'smartbox-types';
import { myRentDetailsQueryKey, rentDetailsQueryKey } from 'src/queries';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const usePayForPeriodMutation = () => {
  return useMutation({
    mutationKey: ['pay-period'],
    mutationFn: async ({
      periodId,
      rentId,
    }: {
      periodId: string;
      rentId: string;
    }) => {
      const response = await ApiService.callFetch<PayForRentResponse>(
        'post',
        `rent/pay-period/${rentId}/${periodId}?source=${Capacitor.isNativePlatform() ? 'mobile' : 'web'}`,
        null,
        null,
      );

      return response;
    },
    onSuccess: (_data, { rentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['my-rents'] });
      void queryClient.invalidateQueries({ queryKey: ['my-rent-story'] });
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
      void queryClient.invalidateQueries({ queryKey: ['payment'] });
      void queryClient.invalidateQueries({ queryKey: myRentDetailsQueryKey(rentId) });
      void queryClient.invalidateQueries({ queryKey: rentDetailsQueryKey(rentId) });
    },
  });
};
