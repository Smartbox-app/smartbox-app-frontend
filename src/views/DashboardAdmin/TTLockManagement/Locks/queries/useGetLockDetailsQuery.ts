import { useQuery } from '@tanstack/react-query';

import { TTLockDeviceDetails } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const useGetLockDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ['lock-details', id],
    queryFn: async () => {
      const response = await ApiService.callFetch<TTLockDeviceDetails>(
        'get',
        `driver/locks/${id}`,
      );

      if (response) return response;
      return null;
    },
  });
};
