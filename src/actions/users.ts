import { UserRole } from 'smartbox-types';
import ApiService from '../services/api-service';
import { notifications } from '../actions';
import { __ } from '../helpers/i18n';

export const blockUser = (userId: string, userRole: UserRole = UserRole.admin) => async (dispatch: any) => {
  await ApiService.patch(
    dispatch,
    'BLOCK_USER_SUCCESS',
    'BLOCK_USER_FAILED',
    () => {
      dispatch(notifications.successNotification(__('notification.userBlocked')));
    },
    null,
    `user/block/${userId}`,
    'LOADING',
    {},
  );
};

export const enableUser = (userId: string, userRole: UserRole = UserRole.admin) => async (dispatch: any) => {
  await ApiService.patch(
    dispatch,
    'ENABLE_USER_SUCCESS',
    'ENABLE_USER_FAILED',
    () => {
      dispatch(notifications.successNotification('Odblokowano użytkownika!'));
    },
    null,
    `user/enable/${userId}`,
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
      dispatch(notifications.successNotification('Pobrano dane!'));
    },
    null,
    `user/details/${userId}`,
  );
};
