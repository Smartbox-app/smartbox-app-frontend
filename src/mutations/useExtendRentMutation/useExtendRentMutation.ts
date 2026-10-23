import { useMutation } from '@tanstack/react-query';
import { Capacitor } from '@capacitor/core';
import { PayForRentResponse } from 'smartbox-types';
import ApiService from '../../services/api-service';

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
  });
