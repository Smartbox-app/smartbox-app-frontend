import { useQuery } from '@tanstack/react-query';
import ApiService from 'src/services/api-service';

export const companyInvoiceServiceStatusQueryKey = (companyId: string) =>
  ['company', companyId, 'invoice-service-status'] as const;

export const useCompanyInvoiceServiceStatusQuery = (companyId?: string) =>
  useQuery({
    enabled: !!companyId,
    queryKey: companyId
      ? companyInvoiceServiceStatusQueryKey(companyId)
      : ['company', 'missing', 'invoice-service-status'],
    queryFn: () =>
      ApiService.callFetch<boolean>(
        'GET',
        `company/invoice-service-status/${companyId}`,
      ),
    refetchInterval: 60000,
    retry: false,
  });
