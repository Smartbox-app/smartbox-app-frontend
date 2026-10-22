import { useMutation } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import type { InviteUsersRes, Language, UserRole } from 'smartbox-types';

type InviteWorkerReq = {
  emails: string[];
  role: UserRole;
  lang: Language;
  tenantId?: string;
  stockIds: { value: string; name: string }[];
};

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
