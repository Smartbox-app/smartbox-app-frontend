import { Capacitor } from '@capacitor/core';
import { useMutation } from '@tanstack/react-query';

import { PayForRentResponse } from 'smartbox-types';
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
  });
