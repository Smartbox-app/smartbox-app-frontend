import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { refreshApiTableData } from 'src/actions/api-table';
import { successNotification } from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useDeleteMobileConfigMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['mobile-config', 'delete'],
    mutationFn: async (configId: string) => {
      await ApiService.callFetch('DELETE', `mobile-config/${configId}`);
    },
    onSuccess: () => {
      dispatch(successNotification('mobileConfig.deleted'));
      dispatch(refreshApiTableData());
    },
  });
};
