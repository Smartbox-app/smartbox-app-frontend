import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { successNotification } from 'src/actions/notifications';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

type UseMarkAlertReadMutationOptions = {
  onSuccess?: () => void;
};

export const useMarkAlertReadMutation = (
  options?: UseMarkAlertReadMutationOptions,
) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['system-alert', 'read'],
    mutationFn: async (alertId: string) => {
      await ApiService.callFetch('PATCH', `system-alert/${alertId}/read`);
    },
    onSuccess: () => {
      dispatch(successNotification('application.alertMarkedRead'));
      queryClient.invalidateQueries({ queryKey: ['api-table'] });
      options?.onSuccess?.();
    },
  });
};
