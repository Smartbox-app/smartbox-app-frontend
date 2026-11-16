import { useMutation, useQueryClient } from '@tanstack/react-query';

import { myRentDetailsQueryKey, rentDetailsQueryKey } from 'src/queries';
import ApiService from 'src/services/api-service';

export const useEndMyAgreementMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['end-my-agreement'],
    mutationFn: async ({ rentId }: { rentId: string }) => {
      await ApiService.callFetch(
        'PATCH',
        `rent/end-agreement/${rentId}`,
        undefined,
        undefined,
        undefined,
        true,
      );
    },
    onSuccess: (_data, { rentId }) => {
      queryClient.invalidateQueries({ queryKey: ['my-rents'] });
      queryClient.invalidateQueries({ queryKey: ['my-rent-story'] });
      queryClient.invalidateQueries({ queryKey: ['my-authorized-rents'] });
      queryClient.invalidateQueries({ queryKey: ['api-table'] });
      queryClient.invalidateQueries({
        queryKey: myRentDetailsQueryKey(rentId),
      });
      queryClient.invalidateQueries({
        queryKey: rentDetailsQueryKey(rentId),
      });
      queryClient.invalidateQueries({
        queryKey: ['rent-authorized-users', rentId],
      });
    },
  });
};
