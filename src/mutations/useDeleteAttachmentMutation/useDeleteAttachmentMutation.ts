import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useDeleteAttachmentMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['attachment', 'delete'],
    mutationFn: async (attachmentId: string) => {
      await ApiService.callFetch('DELETE', `attachment/${attachmentId}`);
    },
    onSuccess: () => {
      dispatch(successNotification('application.attachmentDeleted'));
      dispatch(refreshApiTableData());
    },
  });
};
