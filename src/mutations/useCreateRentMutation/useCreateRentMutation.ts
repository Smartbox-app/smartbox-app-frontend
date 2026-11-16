import { Capacitor } from '@capacitor/core';
import { useMutation } from '@tanstack/react-query';

import { PayForRentResponse } from 'smartbox-types';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useCreateRentMutation = () =>
  useMutation({
    mutationKey: ['rent', 'create'],
    mutationFn: async (body: FormData) =>
      ApiService.callFetch<PayForRentResponse>(
        'POST',
        `rent/new?source=${Capacitor.isNativePlatform() ? 'mobile' : 'web'}`,
        undefined,
        undefined,
        body,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-rents'] });
      void queryClient.invalidateQueries({ queryKey: ['my-rent-story'] });
      void queryClient.invalidateQueries({ queryKey: ['my-authorized-rents'] });
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
      void queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });
