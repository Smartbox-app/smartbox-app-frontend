import { useQuery } from '@tanstack/react-query';

import ApiService from 'src/services/api-service';
import { SelectOption } from 'src/types/select';

export const useGetTenantOptionsQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['document', 'tenants'],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const response = await ApiService.callFetch<SelectOption[]>(
        'get',
        'tenant/select',
      );

      return response || [];
    },
    gcTime: 600000,
    retry: false,
  });
};
