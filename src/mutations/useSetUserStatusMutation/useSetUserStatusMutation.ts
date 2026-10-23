import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { UserStatus } from 'smartbox-types';
import ApiService from '../../services/api-service';
import { refreshApiTableData } from '../../actions/api-table';
import { successNotification } from '../../actions/notifications';

export type SetUserStatusAction = 'active' | 'blocked';

type SetUserStatusVariables = {
  userId: string;
  status: SetUserStatusAction;
};

type UseSetUserStatusMutationOptions = {
  onSuccess?: () => void;
};

export const useSetUserStatusMutation = (
  options?: UseSetUserStatusMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['user', 'status'],
    mutationFn: async ({ userId, status }: SetUserStatusVariables) => {
      const apiStatus =
        status === 'active' ? UserStatus.active : UserStatus.blocked;

      await ApiService.callFetch(
        'PATCH',
        `user/status/${userId}/${apiStatus}`,
        undefined,
        undefined,
        {},
      );
    },
    onSuccess: (_data, variables) => {
      dispatch(
        successNotification(
          variables.status === 'active'
            ? 'notification.userUnblocked'
            : 'notification.userBlocked',
        ),
      );
      dispatch(refreshApiTableData());
      options?.onSuccess?.();
    },
  });
};
