import { useMutation } from '@tanstack/react-query';

import { RegisterUserRes } from 'smartbox-types';
import { RegisterDto } from 'src/dto/RegisterDto';
import ApiService from 'src/services/api-service';

export const useRegisterMutation = () => {
  return useMutation({
    mutationKey: ['register'],
    mutationFn: async (dto: RegisterDto) => {
      const response = await ApiService.callFetch<RegisterUserRes>(
        'post',
        'user/new',
        null,
        null,
        dto,
        true,
      );

      return response ?? {};
    },
  });
};
