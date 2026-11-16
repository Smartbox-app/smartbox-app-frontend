import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useDeleteApiAccessMutation = () =>
  useMutation({
    mutationKey: ['api-access', 'delete'],
    mutationFn: async (id: string) => {
      await ApiService.callFetch(
        'DELETE',
        `api-access/${id}`,
        undefined,
        undefined,
        undefined,
        true,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
    },
  });
