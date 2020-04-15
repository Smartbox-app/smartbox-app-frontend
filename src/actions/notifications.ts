import { ApiErrorCode } from 'application-types';

export const successNotification = (text: string) => ({
  type: 'SUCCESS_NOTIFICATION',
  payload: text,
});

export const errorNotification = (error: ApiErrorCode) => ({
  type: 'ERROR_NOTIFICATION',
  payload: error,
});

export const hideNotification = (id: string) => ({
  type: 'HIDE_NOTIFICATION',
  payload: id,
});
