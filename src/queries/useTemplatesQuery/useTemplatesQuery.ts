import { useQuery } from '@tanstack/react-query';
import { TemplateEntity, UserRole } from 'smartbox-types';
import ApiService from '../../services/api-service';
import { useGetMyDetailsQuery } from '../useGetMyDetailsQuery';

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
