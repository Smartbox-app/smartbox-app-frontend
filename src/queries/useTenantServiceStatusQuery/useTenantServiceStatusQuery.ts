import { useQuery } from '@tanstack/react-query';

import ApiService from 'src/services/api-service';

type TenantServiceStatus = 'payment' | 'invoice' | 'sms';

export const tenantServiceStatusQueryKey = (
  tenantId: string,
  service: TenantServiceStatus,
) => ['tenant', tenantId, `${service}-service-status`] as const;

const useTenantServiceStatusQuery = (
  tenantId: string | undefined,
  service: TenantServiceStatus,
) =>
  useQuery({
    enabled: !!tenantId,
    queryKey: tenantId
      ? tenantServiceStatusQueryKey(tenantId, service)
      : ['tenant', 'missing', `${service}-service-status`],
    queryFn: () =>
      ApiService.callFetch<boolean>(
        'GET',
        `tenant/${service}-service-status/${tenantId}`,
      ),
    refetchInterval: 60000,
    retry: false,
  });

export const usePaymentServiceStatusQuery = (tenantId?: string) =>
  useTenantServiceStatusQuery(tenantId, 'payment');

export const useInvoiceServiceStatusQuery = (tenantId?: string) =>
  useTenantServiceStatusQuery(tenantId, 'invoice');

export const useSmsServiceStatusQuery = (tenantId?: string) =>
  useTenantServiceStatusQuery(tenantId, 'sms');
