import { useMutation } from '@tanstack/react-query';

import { DocumentRes } from 'smartbox-types';
import { DocumentDto } from 'src/dto/DocumentDto';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useUpdateDocumentMutation = (id: string) => {
  return useMutation({
    mutationKey: ['document', id],
    mutationFn: async (dto: DocumentDto) => {
      const response = await ApiService.callFetch<DocumentRes>(
        'PATCH',
        `document/${id}`,
        null,
        null,
        dto,
        true
      );

      return response;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['document'] });
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
    },
  });
};
