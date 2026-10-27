import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
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
    onSuccess: () => {
      dispatch(successNotification('notification.userDeleted'));
      dispatch(refreshApiTableData());
      options?.onSuccess?.();
    },
  });
};
