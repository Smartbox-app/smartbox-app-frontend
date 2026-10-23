import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { rentDetailsQueryKey } from '../../queries/useRentDetailsQuery/useRentDetailsQuery';

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
