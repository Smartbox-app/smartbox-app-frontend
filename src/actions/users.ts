import { UserStatus } from 'smartbox-types';
import ApiService from '../services/api-service';
import { __ } from '../helpers/i18n';
import { refreshApiTableData } from './api-table';
import { successNotification } from './notifications';

export const blockUser = (userId: string) => async (dispatch: any) => {
  await ApiService.patch(
    dispatch,
    'BLOCK_USER_SUCCESS',
    'BLOCK_USER_FAILED',
    () => {
      dispatch(successNotification(__('notification.userBlocked')));
      dispatch(refreshApiTableData());
    },
    null,
    `user/status/${userId}/${UserStatus.blocked}`,
    'LOADING',
    {},
  );
};

export const enableUser = (userId: string) => async (dispatch: any) => {
  await ApiService.patch(
    dispatch,
    'ENABLE_USER_SUCCESS',
    'ENABLE_USER_FAILED',
    () => {
      dispatch(successNotification(__('notification.userUnblocked')));
      dispatch(refreshApiTableData());
    },
    null,
    `user/status/${userId}/${UserStatus.active}`,
    'LOADING',
    {},
  );
};

export const fetchSingleUser = (userId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_SINGLE_USER_SUCCESS',
    'FETCH_SINGLE_USER_FAILED',
    () => {
      dispatch(successNotification('Pobrano dane!'));
    },
    null,
    `user/details/${userId}`,
  );
};
