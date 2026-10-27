import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import i18next from 'i18next';
import { useDispatch } from 'react-redux';

import { notifications, order } from 'src/actions';
import { detectBrowserLanguage } from 'src/i18n/app-language';
import ApiService from 'src/services/api-service';
import SessionService from 'src/services/session-service';

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
      void queryClient.invalidateQueries({ queryKey: ['api-table'] });
      dispatch({ type: 'REFRESH_API_GRID' });
      dispatch(order.clearOrder());

      if(Capacitor.isNativePlatform()) {
        Preferences.clear();
      }

      return response;
    },
    onSuccess: () => {
      SessionService.clearCurrentLanguage();
      queryClient.setQueryData(['my-details'], () => null);

      const browserLang = detectBrowserLanguage();
      const active = i18next.language?.toLowerCase().split('-')[0];
      if (active !== browserLang) {
        window.location.reload();
      }
    },
  });
};
