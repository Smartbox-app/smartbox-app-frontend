import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

type UseResendUserActivationMutationOptions = {
  onSuccess?: () => void;
};

export const useResendUserActivationMutation = (
  options?: UseResendUserActivationMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['user', 'resend-activation'],
    mutationFn: async (userId: string) => {
      await ApiService.callFetch(
        'POST',
        `user/${userId}/resend-activation-email`,
        undefined,
        undefined,
        {},
      );
    },
    onSuccess: () => {
      dispatch(successNotification('notification.activationEmailResent'));
      dispatch(refreshApiTableData());
      options?.onSuccess?.();
    },
  });
};
