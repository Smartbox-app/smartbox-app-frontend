import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';

export const useRemoveRentAuthorizedUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['remove-rent-authorized-user'],
    mutationFn: async ({
      rentId,
      authorizationId,
    }: {
      rentId: string;
      authorizationId: string;
    }) => {
      await ApiService.callFetch(
        'DELETE',
        `rent/${rentId}/authorization/${authorizationId}`,
        undefined,
        undefined,
        undefined,
        true,
      );
    },
    onSuccess: (_data, { rentId }) => {
      queryClient.invalidateQueries({
        queryKey: ['rent-authorized-users', rentId] ,
      });
    },
  });
};
