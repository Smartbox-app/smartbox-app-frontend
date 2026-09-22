import { TenantForClients, TenantForUsers } from 'smartbox-types';
import { queryClient } from 'src/query-client';
import { getHostName } from 'src/utils/hostname';

export const TENANT_QUERY_KEY = 'tenant';

export type CachedTenant = TenantForUsers | TenantForClients;

export const getTenantQueryKey = (clientId = getHostName()) =>
  [TENANT_QUERY_KEY, clientId ?? 'default'] as const;

export const getCachedTenant = () =>
  queryClient.getQueryData<CachedTenant>(getTenantQueryKey());
