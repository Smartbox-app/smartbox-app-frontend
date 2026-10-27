import { Capacitor } from '@capacitor/core';
import { useMutation } from '@tanstack/react-query';

import { PayForRentResponse } from 'smartbox-types';
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
  });
};
