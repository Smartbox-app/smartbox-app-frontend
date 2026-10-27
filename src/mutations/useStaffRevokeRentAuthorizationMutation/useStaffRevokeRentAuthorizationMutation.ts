import { useMutation } from '@tanstack/react-query';

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
  });
