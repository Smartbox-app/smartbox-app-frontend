import { useMutation } from '@tanstack/react-query';

import { ActivateUserByCodeDto } from 'src/dto/ActivateUserByCodeDto';
import ApiService from 'src/services/api-service';

export const useActivateUserByCodeMutation = () =>
  useMutation({
    mutationKey: ['activate-user-by-code'],
    mutationFn: async (dto: ActivateUserByCodeDto) =>
      ApiService.callFetch(
        'POST',
        'user/active-by-code',
        undefined,
        undefined,
        {
          activationToken: dto.activationToken,
          code: dto.code.trim(),
        },
        true,
      ),
  });
