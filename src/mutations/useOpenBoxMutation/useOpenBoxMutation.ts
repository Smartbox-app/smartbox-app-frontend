import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import {
  errorNotificationText,
  successNotification,
} from 'src/actions/notifications';
import ApiService from 'src/services/api-service';

export const useOpenBoxMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ['box', 'open'],
    mutationFn: async (boxId: string) => {
      const isSuccess = await ApiService.callFetch<boolean>(
        'GET',
        `box/open/${boxId}`,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
      );
      return !!isSuccess;
    },
    onSuccess: (isSuccess) => {
      if (isSuccess) {
        dispatch(successNotification('application.boxOpenedSuccessfully'));
      } else {
        dispatch(errorNotificationText('application.cannotOpenBox'));
      }
    },
  });
};
