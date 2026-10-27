import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

type UseDeleteInvitationMutationOptions = {
  onSuccess?: () => void;
};

export const useDeleteInvitationMutation = (
  options?: UseDeleteInvitationMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['user', 'invitation', 'delete'],
    mutationFn: async (invitationId: string) => {
      await ApiService.callFetch(
        'DELETE',
        `user/invitation/${invitationId}`,
      );
    },
    onSuccess: () => {
      dispatch(successNotification('notification.invitationDeleted'));
      dispatch(refreshApiTableData());
      options?.onSuccess?.();
    },
  });
};
