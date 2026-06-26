import { useQuery } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { DocumentRes } from 'smartbox-types';

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
