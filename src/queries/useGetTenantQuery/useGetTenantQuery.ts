import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TenantForClients, TenantForUsers } from 'smartbox-types';
import ApiService from '../../services/api-service';
import { getHostName } from 'src/utils/hostname';
import { getDefaultTenant } from './default-tenant';
import { getTenantQueryKey, TENANT_QUERY_KEY } from './tenant-query';

const TENANT_REFETCH_INTERVAL_MS = 60_000;

export const useGetTenantQuery = () => {
  const clientId = getHostName();

  return useQuery({
    queryKey: getTenantQueryKey(clientId),
    queryFn: async (): Promise<TenantForUsers | TenantForClients> => {
      if (!clientId) {
        return getDefaultTenant();
      }

      const response = await ApiService.callFetch<TenantForUsers | TenantForClients>(
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

export const useInvalidateTenantQuery = () => {
  const queryClient = useQueryClient();

  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: [TENANT_QUERY_KEY] }),
    [queryClient],
  );
};
