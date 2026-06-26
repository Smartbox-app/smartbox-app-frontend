import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { DocumentRes } from 'smartbox-types';
import { DocumentDto } from 'src/dto/DocumentDto';

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
