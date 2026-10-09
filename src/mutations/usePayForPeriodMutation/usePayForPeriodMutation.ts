import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { PayForRentResponse } from 'smartbox-types';
import { Capacitor } from '@capacitor/core';

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
