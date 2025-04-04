import { v4 } from 'uuid';
import { ApiErrorCode } from 'smartbox-types';
import { SingleNotification } from '../types/notifications';
import { translateApiErrorCode } from '../utils/trans-form';

interface HideNotification {
  type: 'HIDE_NOTIFICATION';
  payload: string;
}

interface SuccessNotification {
  type: 'SUCCESS_NOTIFICATION';
  payload: string;
}

interface ErrorNotification {
  type: 'ERROR_NOTIFICATION';
  payload: ApiErrorCode;
}

interface ErrorNotificationText {
  type: 'ERROR_NOTIFICATION_TEXT';
  payload: string;
}

type Action = HideNotification | SuccessNotification | ErrorNotification | ErrorNotificationText;

export type NotificationState = SingleNotification[];

const initialState: NotificationState = [];

const getError = (error: ApiErrorCode) => translateApiErrorCode(error, 'pl');

const getErrorNotification = (text: string) => ({
  type: 'error',
  text,
  id: v4(),
});

const getSuccessNotification = (text: string) => ({
  type: 'success',
  text,
  id: v4(),
});

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case 'SUCCESS_NOTIFICATION': {
      const notification = getSuccessNotification(action.payload);
      return [...state, notification];
    }
    case 'ERROR_NOTIFICATION': {
      const notification = getErrorNotification(getError(action.payload));
      return [...state, notification];
    }
    case 'ERROR_NOTIFICATION_TEXT': {
      const notification = getErrorNotification(action.payload);
      return [...state, notification];
    }
    case 'HIDE_NOTIFICATION':
      return state.filter((notification: SingleNotification) => notification.id !== action.payload);
    default:
      return state;
  }
};
