import { useMutation } from '@tanstack/react-query';

import { DocumentRes } from 'smartbox-types';
import { DocumentDto } from 'src/dto/DocumentDto';
import ApiService from 'src/services/api-service';

export const usePublishDocumentMutation = (id?: string) => {
  return useMutation({
    mutationKey: ['document', id ?? 'new', 'publish'],
    mutationFn: async (dto: DocumentDto) => {
      const response = await ApiService.callFetch<DocumentRes>(
        'POST',
        id ? `document/${id}/publish` : 'document',
        null,
        null,
        dto,
        true,
      );

      return response;
    },
  });
};
