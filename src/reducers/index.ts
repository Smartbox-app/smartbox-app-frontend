import { combineReducers } from 'redux';
import apiTableReducer from './api-table-reducer';
import appStatusReducer from './app-status-reducer';
import modalReducer from './modal-reducer';
import notificationsReducer from './notifications-reducer';
import langReducer from './lang-reducer';
import userReducer from './user-reducer';
import spinnerReducer from './spinner-reducer';
import orderReducer from './order-reducer';

const appReducer = combineReducers({
  appStatus: appStatusReducer,
  apiTable: apiTableReducer,
  lang: langReducer,
  modal: modalReducer,
  notifications: notificationsReducer,
  user: userReducer,
  spinner: spinnerReducer,
  order: orderReducer,
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

export default rootReducer;
