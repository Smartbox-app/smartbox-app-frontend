import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { successNotification } from 'src/actions/notifications';
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
      options?.onSuccess?.();
    },
  });
};
