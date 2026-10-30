import { useMutation } from '@tanstack/react-query';

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
  });
