import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiService from '../../services/api-service';
import { useDispatch } from 'react-redux';
import { notifications, order } from 'src/actions';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async () => {
      const response = await ApiService.callFetch(
        'get',
        'auth/logout',
        null,
        null,
      );

      dispatch(notifications.successNotification('notification.logOutSuccess'));
      dispatch({ type: 'REFRESH_API_TABLE' });
      dispatch({ type: 'REFRESH_API_GRID' });
      dispatch(order.clearOrder());

      if(Capacitor.isNativePlatform()) {
        Preferences.clear();
      }

      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData(['my-details'], () => null);
    },
  });
};
