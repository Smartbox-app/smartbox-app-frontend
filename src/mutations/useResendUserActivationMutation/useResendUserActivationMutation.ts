import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import ApiService from '../../services/api-service';
import { refreshApiTableData } from '../../actions/api-table';
import { successNotification } from '../../actions/notifications';

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
