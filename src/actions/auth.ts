import { AuthLoginResult } from 'smartbox-types';

export const saveUser = (userData: AuthLoginResult) => ({
  type: 'LOGIN_SUCCESS',
  payload: userData,
});

export const clearUserSession = () => ({ type: 'CLEAR_USER_SESSION' });
