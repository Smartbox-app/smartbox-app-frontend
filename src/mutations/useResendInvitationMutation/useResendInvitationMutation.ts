import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { successNotification } from 'src/actions/notifications';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

type UseResendInvitationMutationOptions = {
  onSuccess?: () => void;
};

export const useResendInvitationMutation = (
  options?: UseResendInvitationMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['user', 'invitation', 'resend'],
    mutationFn: async (invitationId: string) => {
      await ApiService.callFetch(
        'GET',
        `user/resend-invitation/${invitationId}`,
      );
    },
    onSuccess: () => {
      dispatch(successNotification('notification.invitationResent'));
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
      options?.onSuccess?.();
    },
  });
};
