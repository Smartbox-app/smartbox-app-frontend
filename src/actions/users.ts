import { UserStatus } from 'smartbox-types';
import ApiService from '../services/api-service';
import { refreshApiTableData } from './api-table';
import { successNotification } from './notifications';

export const blockUser = (userId: string) => async (dispatch: any) => {
  await ApiService.patch(
    dispatch,
    'BLOCK_USER_SUCCESS',
    'BLOCK_USER_FAILED',
    () => {
      dispatch(successNotification('notification.userBlocked'));
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
      dispatch(successNotification('notification.userUnblocked'));
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
    null,
    null,
    `user/details/${userId}`,
  );
};

export const fetchMyData = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'GET_MY_DETAILS_SUCCESS', 'GET_MY_DETAILS_FAILED', null, null, 'user/me');
};

export const acceptationCookies = () => ({ type: 'ACCEPTATION_COOKIES', payload: true });

export const fetchUserDetailsForAdmin = (userId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_USER_DETAILS_FOR_ADMIN_SUCCESS',
    'FETCH_USER_DETAILS_FOR_ADMIN_FAILED',
    null,
    null,
    `user/details/${userId}`,
  );
};
