import { UserStatus } from 'smartbox-types';
import ApiService from '../services/api-service';
import { refreshApiTableData } from './api-table';
import { successNotification } from './notifications';

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

export const deleteUser = (userId: string) => async (dispatch: any) => {
  await ApiService.delete(
    dispatch,
    'DELETE_USER_SUCCESS',
    'DELETE_USER_FAILED',
    () => {
      dispatch(successNotification('notification.userDeleted'));
      dispatch(refreshApiTableData());
    },
    null,
    `user/${userId}`,
    'LOADING',
  );
};

export const deleteUserByForce = (userId: string) => async (dispatch: any) => {
  await ApiService.delete(
    dispatch,
    'DELETE_USER_BY_FORCE_SUCCESS',
    'DELETE_USER_BY_FORCE_FAILED',
    () => {
      dispatch(successNotification('notification.userDeleted'));
      dispatch(refreshApiTableData());
    },
    null,
    `user/force/${userId}`,
    'LOADING',
  );
};

export const resendActivationEmail = (userId: string) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'RESEND_ACTIVATION_EMAIL_SUCCESS',
    'RESEND_ACTIVATION_EMAIL_FAILED',
    () => {
      dispatch(successNotification('notification.activationEmailResent'));
      dispatch(refreshApiTableData());
    },
    null,
    `user/${userId}/resend-activation-email`,
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
    'LOADING_SINGLE_USER'
  );
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
