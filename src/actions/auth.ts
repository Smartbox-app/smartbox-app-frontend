import { AuthLoginRequest, AuthLoginResult } from 'smartbox-types';
import ApiService from '../services/api-service';
import { notifications } from '../actions';
import { history } from '../App';
import { hideModal } from './modal';
import { getRememberedRedirect, clearRememberedRedirect } from '../utils/remeber-redirect';

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

      if (redirect && redirect.role === response.user.role) {
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
