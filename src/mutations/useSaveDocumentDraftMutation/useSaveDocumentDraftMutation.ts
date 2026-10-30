import { useMutation } from '@tanstack/react-query';

import { DocumentRes } from 'smartbox-types';
import { DocumentDto } from 'src/dto/DocumentDto';
import ApiService from 'src/services/api-service';

export const useSaveDocumentDraftMutation = (id: string) => {
  return useMutation({
    mutationKey: ['document', id, 'draft'],
    mutationFn: async (dto: DocumentDto) => {
      const response = await ApiService.callFetch<DocumentRes>(
        'PATCH',
        `document/${id}/draft`,
        null,
        null,
        dto,
        true,
      );

      return response;
    },
  });
};
