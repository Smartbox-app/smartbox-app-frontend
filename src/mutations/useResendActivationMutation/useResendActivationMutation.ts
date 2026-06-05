import { useMutation } from '@tanstack/react-query';
import ApiService from 'src/services/api-service';
import { RegisterUserRes } from 'smartbox-types';

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
