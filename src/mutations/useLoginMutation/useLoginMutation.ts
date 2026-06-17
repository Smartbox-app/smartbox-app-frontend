import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { LoginDto } from '../../dto/LoginDto';
import { ApiErrorCode, AuthLoginResult } from 'smartbox-types';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export class LoginMutationError extends Error {
  constructor(
    public readonly errorCode: ApiErrorCode,
    public readonly payload?: unknown,
  ) {
    super(String(errorCode));
    this.name = 'LoginMutationError';
  }
}

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (dto: LoginDto) => {
      const response = await new Promise<AuthLoginResult | undefined>(
        (resolve, reject) => {
          ApiService.callFetch<AuthLoginResult>(
            'post',
            `auth/login${Capacitor.isNativePlatform() ? '?source=mobile' : ''}`,
            (payload) => resolve(payload),
            (data) =>
              reject(new LoginMutationError(data.error_code, data.payload)),
            dto,
            undefined,
            true,
          );
        },
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
