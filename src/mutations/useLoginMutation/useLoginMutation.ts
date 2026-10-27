import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiErrorCode } from 'smartbox-types';
import { LoginDto } from 'src/dto/LoginDto';
import ApiService from 'src/services/api-service';

type LoginPayload = {
  accessToken?: string;
};

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
      const response = await new Promise<LoginPayload | undefined>(
        (resolve, reject) => {
          ApiService.callFetch<LoginPayload>(
            'post',
            `auth/login${Capacitor.isNativePlatform() ? '?source=mobile' : ''}`,
            (payload: LoginPayload) => resolve(payload),
            (data) =>
              reject(
                new LoginMutationError(
                  data.error_code as unknown as ApiErrorCode,
                  data.payload,
                ),
              ),
            dto,
            undefined,
            true,
          );
        },
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
