import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

export const useGetVersionQuery = () => {
  return useQuery({
    queryKey: ['version'],
    queryFn: async () => {
      if (Capacitor.isNativePlatform()) {
        const { platform } = await Device.getInfo();
        const { id } = await App.getInfo();

        try {
          const response = await ApiService.callFetch<{
            versions: string[];
            isMaintenance: boolean;
          }>(
            'get',
            `mobile-config/${platform}/${id}`,
            undefined,
            undefined,
            undefined,
            true,
          );
          return response;
        } catch (e) {
          throw e;
        }
      }

      try {
        const response = await ApiService.callFetch<string>(
          'get',
          'settings/version',
          undefined,
          undefined,
          undefined,
          true,
        );

        if (response) return { versions: [response], isMaintenance: false };
        throw new Error('No version available');
      } catch (e) {
        throw e;
      }
    },
    retry: false,
    refetchInterval: 3000,
  });
};
