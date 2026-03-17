import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { DocumentRes } from 'smartbox-types';
import { DocumentDto } from 'src/dto/DocumentDto';

export const useCreateDocumentMutation = () => {
  return useMutation({
    mutationKey: ['document'],
    mutationFn: async (dto: DocumentDto) => {
      const response = await ApiService.callFetch<DocumentRes>(
        'post',
        `document`,
        null,
        null,
        dto,
        true,
      );

      return response;
    },
  });
};
