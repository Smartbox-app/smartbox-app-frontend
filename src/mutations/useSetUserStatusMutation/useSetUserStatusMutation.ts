import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { UserStatus } from 'smartbox-types';
import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

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
