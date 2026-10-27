import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SocialLoginDto } from 'src/dto/SocialLoginDto';
import ApiService from 'src/services/api-service';

type SocialLoginPayload = {
  accessToken?: string;
};

export const useSocialLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['social-login'],
    mutationFn: async (dto: SocialLoginDto) => {
      const response = await ApiService.callFetch<SocialLoginPayload>(
        'post',
        `auth/social-login`,
        null,
        null,
        dto,
      );

      if (response?.accessToken && Capacitor.isNativePlatform()) {
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
