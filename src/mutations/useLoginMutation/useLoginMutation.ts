import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { LoginDto } from '../../dto/LoginDto';
import { AuthLoginResult } from 'smartbox-types';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (dto: LoginDto) => {
      const response = await ApiService.callFetch<AuthLoginResult>(
        'post',
        `auth/login${Capacitor.isNativePlatform() ? '?source=mobile' : ''}`,
        null,
        null,
        dto,
      );

      if (response && Capacitor.isNativePlatform()) {
        await Preferences.set({
          key: 'smst_token',
          value: response.accessToken,
        });
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['my-details'],
      });
    },
  });
};
