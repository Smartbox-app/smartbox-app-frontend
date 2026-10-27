import { useQuery } from '@tanstack/react-query';

import { TenantSmtpConfig } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const useTenantSmtpConfigQuery = (tenantOwnerId?: string) => {
  return useQuery({
    queryKey: ['tenant-smtp-config', tenantOwnerId],
    gcTime: 0,
    staleTime: 0,
    queryFn: async () => {
      const url = tenantOwnerId ? `tenant/admin/smtp-config/${tenantOwnerId}` : 'tenant/smtp-config';
      const res = await ApiService.callFetch<TenantSmtpConfig>(
        'GET',
        url,
        undefined,
        undefined,
        undefined,
        true,
      );
      return res;
    },
    retry: false,
  });
};
