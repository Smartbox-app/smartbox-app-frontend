import { useQuery } from '@tanstack/react-query';

import { CompanyOption, UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries/useGetMyDetailsQuery';
import ApiService from 'src/services/api-service';

export type CompanySelectOption = { label: string; value: string };

export const useGetCompanyOptionsQuery = (
  tenantId?: string | null,
  enabled = true,
) => {
  const { data: user } = useGetMyDetailsQuery();
  const isAdmin = user?.role === UserRole.admin;
  const canFetch = Boolean(enabled && user && (!isAdmin || tenantId));

  return useQuery({
    queryKey: ['company', 'options', isAdmin ? tenantId : 'session'],
    queryFn: async () => {
      const path = isAdmin
        ? `company/options/${tenantId}`
        : 'company/options';
      const companies = await ApiService.callFetch<CompanyOption[]>(
        'GET',
        path,
      );

      return (companies ?? []).map(
        (company): CompanySelectOption => ({
          label: company.name.toString(),
          value: company.value.toString(),
        }),
      );
    },
    enabled: canFetch,
    gcTime: 300000,
    retry: false,
  });
};
