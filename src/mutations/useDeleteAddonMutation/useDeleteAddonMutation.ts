import { useMutation } from '@tanstack/react-query';

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
  });
