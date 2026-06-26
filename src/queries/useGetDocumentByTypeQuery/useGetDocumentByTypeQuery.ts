import { useQuery } from '@tanstack/react-query';
import { DocumentRes } from 'smartbox-types';
import ApiService from '../../services/api-service';

export const useGetDocumentByTypeQuery = (
  type: string,
  stockId?: string | null,
) => {
  return useQuery({
    queryKey: ['document', 'type', type, stockId ?? 'default'],
    queryFn: async () => {
      const stockQuery = stockId
        ? `?stockId=${encodeURIComponent(stockId)}`
        : '';
      const response = await ApiService.callFetch<DocumentRes>(
        'GET',
        `document/type/${type}${stockQuery}`,
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
