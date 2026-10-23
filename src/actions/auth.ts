import type { AppDispatch } from 'src/types/app-dispatch';
import { AuthLoginResult } from 'smartbox-types';
import ApiService from '../services/api-service';
import { notifications } from '../actions';
import { history } from '../history';

export const saveUser = (userData: AuthLoginResult) => ({
  type: 'LOGIN_SUCCESS',
  payload: userData,
});

export const clearUserSession = () => ({ type: 'CLEAR_USER_SESSION' });

export const emailVerification =
  (userId: string, updateToken: string, pwd?: string, pwd2?: string) =>
  async (dispatch: AppDispatch) => {
    const body =
      pwd || pwd2
        ? {
            ...(pwd ? { pwd } : {}),
            ...(pwd2 ? { pwd2 } : {}),
          }
        : {};

    await ApiService.post(
      dispatch,
      'EMAIL_VERIFICATION_SUCCESS',
      'EMAIL_VERIFICATION_FAILED',
      () => {
        dispatch(
          notifications.successNotification(
            pwd
              ? 'notification.accountHasBeenActivated'
              : 'notification.useEmailVerificationSuccess',
          ),
        );
        history.push(pwd ? '/login' : '/');
      },
      null,
      `user/active/${userId}/${updateToken}`,
      'LOADING',
      body,
    );
  };
