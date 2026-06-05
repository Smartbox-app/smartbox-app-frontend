import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { RegisterUserRes } from 'smartbox-types';
import { RegisterDto } from 'src/dto/RegisterDto';

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
      );

      return response ?? {};
    },
  });
};
