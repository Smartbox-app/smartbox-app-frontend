import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

type UseDeleteUserByForceMutationOptions = {
  onSuccess?: () => void;
};

export const useDeleteUserByForceMutation = (
  options?: UseDeleteUserByForceMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['user', 'delete-by-force'],
    mutationFn: async (userId: string) => {
      await ApiService.callFetch('DELETE', `user/force/${userId}`);
    },
    onSuccess: () => {
      dispatch(successNotification('notification.userDeleted'));
      dispatch(refreshApiTableData());
      options?.onSuccess?.();
    },
  });
};
