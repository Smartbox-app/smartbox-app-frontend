import { Capacitor } from '@capacitor/core';
import { useMutation } from '@tanstack/react-query';

import { PayForRentResponse } from 'smartbox-types';
import { myRentDetailsQueryKey, rentDetailsQueryKey, rentPeriodConfigQueryKey } from 'src/queries';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useExtendRentMutation = () =>
  useMutation({
    mutationKey: ['rent', 'extend'],
    mutationFn: async ({
      rentId,
      body,
    }: {
      rentId: string;
      body: FormData;
    }) =>
      ApiService.callFetch<PayForRentResponse>(
        'POST',
        `rent/extend-rent/${rentId}?source=${Capacitor.isNativePlatform() ? 'mobile' : 'web'}`,
        undefined,
        undefined,
        body,
      ),
    onSuccess: (_data, { rentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['my-rents'] });
      void queryClient.invalidateQueries({ queryKey: ['my-rent-story'] });
      void queryClient.invalidateQueries({ queryKey: ['my-authorized-rents'] });
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
      void queryClient.invalidateQueries({ queryKey: myRentDetailsQueryKey(rentId) });
      void queryClient.invalidateQueries({ queryKey: rentDetailsQueryKey(rentId) });
      void queryClient.invalidateQueries({ queryKey: rentPeriodConfigQueryKey(rentId) });
    },
  });
