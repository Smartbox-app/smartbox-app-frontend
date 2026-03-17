import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { DocumentRes } from 'smartbox-types';
import { DocumentDto } from 'src/dto/DocumentDto';

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
  });
};
