import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { useQuery } from '@tanstack/react-query';

import {
  AppVersionResponse,
  MobileAppConfigResponse,
} from 'smartbox-types';
import ApiService from 'src/services/api-service';
import { AppConfigInfo } from 'src/types/app-config';

export const useGetVersionQuery = () => {
  return useQuery({
    queryKey: ['version'],
    queryFn: async (): Promise<AppConfigInfo> => {
      if (Capacitor.isNativePlatform()) {
        const { platform } = await Device.getInfo();
        const { id } = await App.getInfo();

        const response = await ApiService.callFetch<MobileAppConfigResponse>(
          'get',
          `mobile-config/${platform}/${id}`,
          undefined,
          undefined,
          undefined,
          true,
          true
        );

        if (!response) {
          throw new Error('No mobile config available');
        }

        return response;
      }

      const response = await ApiService.callFetch<AppVersionResponse>(
        'get',
        'settings/info',
        undefined,
        undefined,
        undefined,
        true,
        true
      );

      if (!response?.version) {
        throw new Error('No version available');
      }

      return{
        versions: [response.version],
        isMaintenance: false,
        messages: response.message ? [response.message] : [],
      }
    },
    retry: false,
    refetchInterval: 3000,
  });
};
