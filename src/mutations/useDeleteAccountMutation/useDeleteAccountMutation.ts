import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';

export const useDeleteAccountMutation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['delete-account', userId],
    mutationFn: async () => {
      const response = await ApiService.callFetch(
        'delete',
        `user/${userId}`,
        null,
        null,
        undefined,
        true
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['my-details'],
      });
    },
  });
};
