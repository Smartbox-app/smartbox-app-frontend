import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useDeleteAddonMutation = () =>
  useMutation({
    mutationKey: ['addon', 'delete'],
    mutationFn: async (addonId: string) => {
      await ApiService.callFetch(
        'DELETE',
        `addon/${addonId}`,
        undefined,
        undefined,
        undefined,
        true,
        true,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
    },
  });
