import { AuthLoginResult, UserRes } from 'smartbox-types';
import ApiService from '../services/api-service';
import { notifications } from '../actions';
import { history } from '../history';

export const saveUser = (userData: AuthLoginResult) => ({
  type: 'LOGIN_SUCCESS',
  payload: userData,
});

export const clearUserSession = () => ({ type: 'CLEAR_USER_SESSION' });

export const emailVerification =
  (userId: string, updateToken: string) => async (dispatch: any) => {
    await ApiService.post(
      dispatch,
      'EMAIL_VERIFICATION_SUCCESS',
      'EMAIL_VERIFICATION_FAILED',
      () => {
        dispatch(
          notifications.successNotification(
            'notification.useEmailVerificationSuccess',
          ),
        );
        history.push('/');
      },
      null,
      `user/active/${userId}/${updateToken}`,
      'LOADING',
      {},
    );
  };

export const emailVerificationResendMail = () => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'EMAIL_VERIFICATION_RESEND_MAIL_SUCCESS',
    'EMAIL_VERIFICATION_RESEND_MAIL_FAILED',
    null,
    null,
    'user/resend-active-email',
    'LOADING',
    {},
  );
};

export const authGmailUser = (googleToken: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'LOGIN_SUCCESS',
    'EMAIL_VERIFICATION_RESEND_MAIL_FAILED',
    (response: { user: UserRes }) => {
      dispatch(notifications.successNotification('notification.logInSuccess'));
      history.push('/');
    },
    null,
    `auth/login-by-google-token/${googleToken}}`,
    'LOADING',
  );
};
