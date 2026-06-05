import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import type { InviteUsersRes, InviteWorkerReq } from 'smartbox-types';

export const useInviteUsersMutation = () =>
  useMutation({
    mutationKey: ['invite-users'],
    mutationFn: async (body: InviteWorkerReq) => {
      const response = await ApiService.callFetch<InviteUsersRes>(
        'POST',
        'user/invite-user',
        undefined,
        undefined,
        body,
        true,
      );

      return response ?? { invited: [], failed: [] };
    },
  });
