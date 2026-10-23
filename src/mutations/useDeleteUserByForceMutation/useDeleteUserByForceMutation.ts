import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import ApiService from '../../services/api-service';
import { refreshApiTableData } from '../../actions/api-table';
import { successNotification } from '../../actions/notifications';

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
