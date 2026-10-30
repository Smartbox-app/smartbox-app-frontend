import { useMutation } from '@tanstack/react-query';

import { RegisterUserRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const useResendActivationMutation = () =>
  useMutation({
    mutationKey: ['resend-activation'],
    mutationFn: async (activationToken: string) =>
      ApiService.callFetch<RegisterUserRes>(
        'POST',
        'user/resend-activation-email',
        undefined,
        undefined,
        { activationToken },
      ),
  });
