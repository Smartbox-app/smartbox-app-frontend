import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useDeleteBoxGroupMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['box-group-new', 'delete'],
    mutationFn: async (boxGroupId: string) => {
      await ApiService.callFetch('DELETE', `box-group-new/${boxGroupId}`);
    },
    onSuccess: () => {
      dispatch(successNotification('application.boxGroupDeleted'));
      dispatch(refreshApiTableData());
    },
  });
};
