import uuidv4 from 'uuid/v4';
import { ApiErrorCode } from 'smartbox-types';
import { SingleNotification } from '../types/notifications';

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

type Action = HideNotification | SuccessNotification | ErrorNotification;

export type NotificationState = SingleNotification[];

const initialState: NotificationState = [];

const getError = (error: ApiErrorCode) => {
  switch (error) {
    case ApiErrorCode.InvalidLoginData:
      return 'Niepoprawne dane logowania.';
    case ApiErrorCode.InvalidPrice:
      return 'Nieprawidłowa cena';
    case ApiErrorCode.UAreTooFarAway:
      return 'Jesteś za daleko';
    default:
      return 'Wystąpił błąd';
  }
};

const getErrorNotification = (text: string) => ({
  type: 'error',
  text,
  id: uuidv4(),
});
const getSuccessNotification = (text: string) => ({
  type: 'success',
  text,
  id: uuidv4(),
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
    case 'HIDE_NOTIFICATION':
      return state.filter((notification: SingleNotification) => notification.id !== action.payload);
    default:
      return state;
  }
};
