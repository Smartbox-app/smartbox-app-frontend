import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

export const useRevokeRentAuthorizationByStaffMutation = () =>
  useMutation({
    mutationKey: ['staff-revoke-rent-authorization'],
    mutationFn: async (authorizationId: string) => {
      await ApiService.callFetch(
        'DELETE',
        `rent/authorizations/${authorizationId}`,
        undefined,
        undefined,
        undefined,
        true,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
      void queryClient.invalidateQueries({ queryKey: ['rent-authorized-users'] });
    },
  });
