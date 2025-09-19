import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NotificationEntity, NotificationReq } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();
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
