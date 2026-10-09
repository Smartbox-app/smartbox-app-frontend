import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
type SocialLoginPayload = {
  accessToken?: string;
};
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { SocialLoginDto } from 'src/dto/SocialLoginDto';

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
