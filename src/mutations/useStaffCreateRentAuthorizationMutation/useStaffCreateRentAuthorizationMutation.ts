import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import type { CreateStaffRentAuthorizationReq } from 'smartbox-types';

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
  });
