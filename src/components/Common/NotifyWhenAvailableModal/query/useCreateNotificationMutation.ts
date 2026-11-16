import { useMutation } from '@tanstack/react-query';

import { NotificationEntity } from 'smartbox-types';
import { queryClient } from 'src/query-client';
import ApiService from 'src/services/api-service';

type NotificationReq = {
  email: boolean;
  sms?: boolean;
  boxGroupId: string;
  tenantId: string;
};

export const useCreateNotificationMutation = () => {
  return useMutation({
    mutationKey: ['discount'],
    mutationFn: async (body: NotificationReq) => {
      const response = await ApiService.callFetch<NotificationEntity>(
        'post',
        'system-notification',
        null,
        null,
        body,
      );

      return response;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
    },
  });
};
