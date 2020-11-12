import { AuthLoginRequest, AuthLoginResult } from 'smartbox-types';
import ApiService from '../services/api-service';
import { notifications, order } from '../actions';
import { history } from '../App';
import { hideModal } from './modal';
import { getRememberedRedirect, clearRememberedRedirect } from '../utils/remeber-redirect';
import { __ } from '../helpers/i18n';

export const saveUser = (userData: AuthLoginResult) => ({ type: 'LOGIN_SUCCESS', payload: userData });

export const loginWithFacebook = (data: any) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'LOGIN_SUCCESS',
    'LOGIN_WITH_FB_FAILED',
    null,
    null,
    `auth/login-facebook?access_token=${data.accessToken}`,
    'LOADING',
    {},
  );
};

export const loginWithGoogle = () => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'LOGIN_SUCCESS',
    'LOGIN_WITH_GOOGLE_FAILED',
    null,
    null,
    'auth/login-google',
    'LOADING',
    {},
  );
};

export const login = (userData: AuthLoginRequest) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    (response: AuthLoginResult) => {
      dispatch(notifications.successNotification(__('notification.logInSuccess')));
      dispatch({ type: 'REFRESH_API_TABLE' });
      dispatch({ type: 'REFRESH_API_GRID' });
      dispatch(hideModal());

      const redirect = getRememberedRedirect();

      if (redirect && redirect.role === response.role) {
        history.push(redirect.to);
        clearRememberedRedirect();
      }
    },
    null,
    'auth/login',
    'LOGIN_LOADING',
    userData,
  );
};

export const logout = () => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'LOGOUT',
    'LOGOUT',
    () => {
      dispatch(notifications.successNotification(__('notification.logOutSuccess')));
      dispatch({ type: 'REFRESH_API_TABLE' });
      dispatch({ type: 'REFRESH_API_GRID' });
      dispatch(order.clearOrderAgreement());
    },
    null,
    'auth/logout',
  );
};

export const clearUserSession = () => ({ type: 'CLEAR_USER_SESSION' });

export const getUserLoginGoogleData = () => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'LOGIN_SUCCESS',
    'LOGIN_WITH_Google_FAILED',
    (data: any) => {
      console.log('getUserLoginGoogleData', data);
    },
    null,
    'auth/login-google/redirect',
  );
};

export const emailVerification = (userId: string, updateToken: string) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'EMAIL_VERIFICATION_SUCCESS',
    'EMAIL_VERIFICATION_FAILED',
    null,
    null,
    `user/active/${userId}/${updateToken}`,
    'LOADING',
    {},
  );
};
