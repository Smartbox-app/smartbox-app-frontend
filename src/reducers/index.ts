import { combineReducers } from 'redux';
import appStatusReducer from './app-status-reducer';
import modalReducer from './modal-reducer';
import notificationsReducer from './notifications-reducer';
import langReducer from './lang-reducer';

const appReducer = combineReducers({
  appStatus: appStatusReducer,
  lang: langReducer,
  modal: modalReducer,
  notifications: notificationsReducer,
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

export default rootReducer;
