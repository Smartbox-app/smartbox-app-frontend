import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useDeleteBoxMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['box', 'delete'],
    mutationFn: async (boxId: string) => {
      await ApiService.callFetch('DELETE', `box/${boxId}`);
    },
    onSuccess: () => {
      dispatch(successNotification('application.boxDeleted'));
      dispatch(refreshApiTableData());
    },
  });
};
