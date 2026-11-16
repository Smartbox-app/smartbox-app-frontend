import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import { userDetailsQueryKey } from 'src/queries';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

type UseDeleteUserMutationOptions = {
  onSuccess?: () => void;
};

export const useDeleteUserMutation = (options?: UseDeleteUserMutationOptions) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['user', 'delete'],
    mutationFn: async (userId: string) => {
      await ApiService.callFetch('DELETE', `user/${userId}`);
    },
    onSuccess: (_data, userId) => {
      dispatch(successNotification('notification.userDeleted'));
      dispatch(refreshApiTableData());
      void queryClient.invalidateQueries({
        queryKey: userDetailsQueryKey(userId),
      });
      options?.onSuccess?.();
    },
  });
};
