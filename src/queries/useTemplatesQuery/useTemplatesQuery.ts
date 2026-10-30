import { useQuery } from '@tanstack/react-query';

import { TemplateEntity, UserRole } from 'smartbox-types';
import { useGetMyDetailsQuery } from 'src/queries/useGetMyDetailsQuery';
import ApiService from 'src/services/api-service';

export const templatesQueryKey = (tenantId: string) =>
  ['templates', tenantId] as const;

export const useTemplatesQuery = (tenantIdOverride?: string) => {
  const { data: user } = useGetMyDetailsQuery();
  const tenantId = tenantIdOverride ?? user?.tenantId ?? undefined;
  const isAdmin = user?.role === UserRole.admin;

  return useQuery({
    enabled: !!user && !!tenantId,
    queryKey: tenantId ? templatesQueryKey(tenantId) : ['templates', 'missing'],
    queryFn: () =>
      ApiService.callFetch<TemplateEntity[]>(
        'GET',
        isAdmin ? `template/admin/all/${tenantId}` : 'template/all',
      ).then((data) => data ?? []),
    retry: false,
  });
};
