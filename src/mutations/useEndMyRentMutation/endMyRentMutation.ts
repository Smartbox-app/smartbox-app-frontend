import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import {
  myRentDetailsQueryKey,
} from '../../queries';

export const useEndMyRentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['end-my-rent'],
    mutationFn: async ({ rentId }: { rentId: string }) => {
      await ApiService.callFetch(
        'PATCH',
        `rent/finish/${rentId}`,
        undefined,
        undefined,
        undefined,
        true,
      );
    },
    onSuccess: (_data, { rentId }) => {
      queryClient.invalidateQueries({ queryKey: ['my-rents'] }),
      queryClient.invalidateQueries({ queryKey: ['my-rent-story'] }),
      queryClient.invalidateQueries({
        queryKey: myRentDetailsQueryKey(rentId),
      });
      queryClient.invalidateQueries({
        queryKey: ['rent-authorized-users', rentId],
      });
    },
  });
};
