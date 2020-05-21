import { combineReducers } from 'redux';
import apiTableReducer from './api-table-reducer';
import appStatusReducer from './app-status-reducer';
import modalReducer from './modal-reducer';
import notificationsReducer from './notifications-reducer';
import langReducer from './lang-reducer';
import userReducer, { UserState } from './user-reducer';
import spinnerReducer, { SpinnerState } from './spinner-reducer';
import orderReducer, { OrderState } from './order-reducer';
import boxesReducer, { Boxes } from './boxes-reducer';
import { Modal } from '../types/modal';

export interface ApplicationState {
  boxes: Boxes;
  order: OrderState;
  user: UserState;
  spinner: SpinnerState;
  modal: Modal;
}

const appReducer = combineReducers({
  appStatus: appStatusReducer,
  apiTable: apiTableReducer,
  lang: langReducer,
  modal: modalReducer,
  notifications: notificationsReducer,
  user: userReducer,
  spinner: spinnerReducer,
  order: orderReducer,
  boxes: boxesReducer,
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

export default rootReducer;
