import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

type CreateStaffRentAuthorizationReq = {
  rentId: string;
  email?: string;
  phone?: string;
};

export const useStaffCreateRentAuthorizationMutation = () =>
  useMutation({
    mutationKey: ['staff-create-rent-authorization'],
    mutationFn: async (body: CreateStaffRentAuthorizationReq) => {
      await ApiService.callFetch(
        'POST',
        'rent/authorizations',
        undefined,
        undefined,
        body,
        true,
      );
    },
    onSuccess: (_data, { rentId }) => {
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
      void queryClient.invalidateQueries({
        queryKey: ['rent-authorized-users', rentId],
      });
    },
  });
