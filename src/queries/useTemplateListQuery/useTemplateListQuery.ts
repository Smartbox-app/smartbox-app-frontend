import { useQuery } from '@tanstack/react-query';
import { TemplateListRow } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const templateListQueryKey = (tenantId?: string) =>
  ['templates', 'list', tenantId ?? 'self'] as const;

export const useTemplateListQuery = (tenantId?: string) =>
  useQuery({
    queryKey: templateListQueryKey(tenantId),
    queryFn: () =>
      ApiService.callFetch<TemplateListRow[]>(
        'GET',
        tenantId ? `template/admin/list/${tenantId}` : 'template/list',
      ).then((rows) => rows ?? []),
    retry: false,
  });
