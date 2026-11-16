import { useMutation } from '@tanstack/react-query';

import { CreateApiAccessRes } from 'smartbox-types';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useRotateApiAccessKeyMutation = () =>
  useMutation({
    mutationKey: ['api-access', 'rotate-key'],
    mutationFn: async (id: string) => {
      const response = await ApiService.callFetch<CreateApiAccessRes>(
        'PATCH',
        `api-access/${id}/rotate-key`,
        undefined,
        undefined,
        undefined,
        true,
      );

      return response;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
    },
  });
