import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { PayForRentResponse } from 'smartbox-types';

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
        `rent/pay-period/${rentId}/${periodId}`,
        null,
        null,
      );

      return response;
    },
  });
};
