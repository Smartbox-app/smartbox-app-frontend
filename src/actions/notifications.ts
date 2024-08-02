import { ApiErrorCode } from 'smartbox-types';

export const successNotification = (text: string) => ({
  type: 'SUCCESS_NOTIFICATION',
  payload: text,
});

export const errorNotification = (error: ApiErrorCode) => ({
  type: 'ERROR_NOTIFICATION',
  payload: error,
});

export const errorNotificationText = (text: string) => ({
  type: 'ERROR_NOTIFICATION_TEXT',
  payload: text,
});

export const hideNotification = (id: string) => ({
  type: 'HIDE_NOTIFICATION',
  payload: id,
});
