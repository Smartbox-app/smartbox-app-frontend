import { useMutation, useQueryClient } from '@tanstack/react-query';

import { rentDetailsQueryKey } from 'src/queries/useRentDetailsQuery/useRentDetailsQuery';
import ApiService from 'src/services/api-service';

export const useRotatePasscodeMutation = (rentId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['rent', 'passcode', 'rotate', rentId],
    mutationFn: async () => {
      if (!rentId) return;
      await ApiService.callFetch(
        'POST',
        `rent/${rentId}/passcode/rotate`,
        undefined,
        undefined,
        undefined,
        true,
      );
    },
    onSuccess: async () => {
      if (rentId) {
        await queryClient.invalidateQueries({
          queryKey: rentDetailsQueryKey(rentId),
        });
      }
    },
  });
};
