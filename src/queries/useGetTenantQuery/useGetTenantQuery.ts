import { useQuery } from '@tanstack/react-query';
import { TenantForUsers } from 'smartbox-types';
import ApiService from '../../services/api-service';
import { getHostName } from 'src/utils/hostname';
import { getDefaultTenant } from './default-tenant';

const TENANT_REFETCH_INTERVAL_MS = 60_000;

export const useGetTenantQuery = () => {
  const clientId = getHostName();

  return useQuery({
    queryKey: ['tenant', clientId ?? 'default'],
    queryFn: async (): Promise<TenantForUsers> => {
      if (!clientId) {
        return getDefaultTenant();
      }

      const response = await ApiService.callFetch<TenantForUsers>(
        'GET',
        `tenant/${clientId}`,
      );

      if (!response) {
        throw new Error('Tenant not found');
      }

      return response;
    },
    refetchInterval: clientId ? TENANT_REFETCH_INTERVAL_MS : false,
    retry: false,
  });
};
