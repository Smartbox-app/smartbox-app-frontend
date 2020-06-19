import { AuthLoginRequest, AuthLoginResult } from 'smartbox-types';
import ApiService from '../services/api-service';
import { notifications } from '../actions';
import { history } from '../App';
import { hideModal } from './modal';
import { getRememberedRedirect, clearRememberedRedirect } from '../utils/remeber-redirect';

export const saveUser = (userData: AuthLoginResult) => ({ type: 'LOGIN_SUCCESS', payload: userData });

export const loginWithFacebook = (data: any) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'LOGIN_WITH_FB_SUCCESS',
    'LOGIN_WITH_FB_FAILED',
    (d: any) => {
      console.log('LOGIN_WITH_FB_SUCCESS', d);
    },
    null,
    `auth/login-facebook?access_token=${data.accessToken}`,
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
      dispatch(notifications.successNotification('Zalogowano poprawnie!'));
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
      dispatch(notifications.successNotification('Wylogowano poprawnie!'));
      dispatch({ type: 'REFRESH_API_TABLE' });
      dispatch({ type: 'REFRESH_API_GRID' });
    },
    null,
    'auth/logout',
  );
};

export const clearUserSession = () => ({ type: 'CLEAR_USER_SESSION' });
