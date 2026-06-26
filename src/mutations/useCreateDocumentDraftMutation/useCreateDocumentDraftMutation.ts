import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { DocumentRes } from 'smartbox-types';
import { DocumentDto } from 'src/dto/DocumentDto';

export const useCreateDocumentDraftMutation = () => {
  return useMutation({
    mutationKey: ['document', 'draft', 'create'],
    mutationFn: async (dto: DocumentDto) => {
      const response = await ApiService.callFetch<DocumentRes>(
        'post',
        'document/draft',
        null,
        null,
        dto,
        true,
      );

      return response;
    },
  });
};
