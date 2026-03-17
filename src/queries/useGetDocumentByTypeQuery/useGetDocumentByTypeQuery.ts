import { useQuery } from '@tanstack/react-query';
import { DocumentRes } from 'smartbox-types';
import ApiService from '../../services/api-service';

export const useGetDocumentByTypeQuery = (type: string) => {
  return useQuery({
    queryKey: ['document', 'type', type],
    queryFn: async () => {
      const response = await ApiService.callFetch<DocumentRes>(
        'GET',
        `document/type/${type}`,
        null,
        null,
        undefined,
        false,
        true,
      );

      if (response) return response;
      return null;
    },
    gcTime: 600000,
    retry: false,
  });
};
