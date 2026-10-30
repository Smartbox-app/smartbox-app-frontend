import { AnyAction, combineReducers } from 'redux';

import apiTableReducer, { ApiTableRootState } from 'src/reducers/api-table-reducer';
import appStatusReducer, { AppStatus } from 'src/reducers/app-status-reducer';
import boxesReducer, { Boxes } from 'src/reducers/boxes-reducer';
import modalReducer from 'src/reducers/modal-reducer';
import notificationsReducer, { NotificationState } from 'src/reducers/notifications-reducer';
import orderReducer, { OrderState } from 'src/reducers/order-reducer';
import rentReducer, { RentsStatus } from 'src/reducers/rent-reducer';
import spinnerReducer, { SpinnerState } from 'src/reducers/spinner-reducer';
import stockGroupReducer, { StockGroupStatus } from 'src/reducers/stock-group-reducer';
import stockReducer, { StockStatus } from 'src/reducers/stock-reducer';
import userReducer, { UserState } from 'src/reducers/user-reducer';
import { Modal } from 'src/types/modal';

export interface ApplicationState {
  apiTable: ApiTableRootState;
  boxes: Boxes;
  order: OrderState;
  user: UserState;
  spinner: SpinnerState;
  modal: Modal;
  appStatus: AppStatus;
  notifications: NotificationState;
  rent: RentsStatus;
  stock: StockStatus;
  stockGroup: StockGroupStatus;
}

const appReducer = combineReducers({
  appStatus: appStatusReducer,
  apiTable: apiTableReducer,
  modal: modalReducer,
  notifications: notificationsReducer,
  user: userReducer,
  spinner: spinnerReducer,
  order: orderReducer,
  boxes: boxesReducer,
  rent: rentReducer,
  stock: stockReducer,
  stockGroup: stockGroupReducer,
});

const rootReducer = (
  state: Parameters<typeof appReducer>[0],
  action: AnyAction,
) => appReducer(state, action);

export default rootReducer;
