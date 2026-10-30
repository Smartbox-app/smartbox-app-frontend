import { useQuery } from '@tanstack/react-query';

import { DocumentRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const documentDraftQueryKey = (id: string) =>
  ['document', id, 'draft'] as const;

export const useGetDocumentDraftQuery = (id?: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: id ? documentDraftQueryKey(id) : ['document', 'draft', 'missing'],
    queryFn: async () => {
      if (!id) return null;

      const response = await ApiService.callFetch<DocumentRes | null>(
        'get',
        `document/${id}/draft`,
      );

      return response ?? null;
    },
  });
};
