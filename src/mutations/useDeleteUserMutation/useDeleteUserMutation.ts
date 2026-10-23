import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import ApiService from '../../services/api-service';
import { refreshApiTableData } from '../../actions/api-table';
import { successNotification } from '../../actions/notifications';

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
