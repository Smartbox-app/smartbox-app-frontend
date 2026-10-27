import { useMutation, useQueryClient } from '@tanstack/react-query';

import ApiService from 'src/services/api-service';

type AddRentAuthorizedUserReq = {
  email?: string;
  phone?: string;
};

export const useAddRentAuthorizedUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add-rent-authorized-user'],
    mutationFn: async ({
      rentId,
      body,
    }: {
      rentId: string;
      body: AddRentAuthorizedUserReq;
    }) => {
      await ApiService.callFetch(
        'POST',
        `rent/${rentId}/authorization`,
        undefined,
        undefined,
        body,
        true,
      );
    },
    onSuccess: (_data, { rentId }) => {
      queryClient.invalidateQueries({
        queryKey: ['rent-authorized-users', rentId],
      });
    },
  });
};
