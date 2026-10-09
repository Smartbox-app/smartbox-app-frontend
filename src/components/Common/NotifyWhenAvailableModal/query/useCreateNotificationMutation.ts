import { useMutation } from '@tanstack/react-query';

import { NotificationEntity } from 'smartbox-types';

type NotificationReq = {
  email: boolean;
  sms?: boolean;
  boxGroupId: string;
  tenantId: string;
};
import ApiService from 'src/services/api-service';

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
  });
};
