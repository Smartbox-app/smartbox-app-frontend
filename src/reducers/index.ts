import { combineReducers } from 'redux';
import apiTableReducer, { ApiTableState } from './api-table-reducer';
import appStatusReducer, { AppStatus } from './app-status-reducer';
import modalReducer from './modal-reducer';
import notificationsReducer, { NotificationState } from './notifications-reducer';
import langReducer, { LangStatus } from './lang-reducer';
import userReducer, { UserState } from './user-reducer';
import spinnerReducer, { SpinnerState } from './spinner-reducer';
import orderReducer, { OrderState } from './order-reducer';
import boxesReducer, { Boxes } from './boxes-reducer';
import rentReducer, { RentsStatus } from './rent-reducer';
import stockReducer, { StockStatus } from './stock-reducer';
import gateReducer, { GateState } from './gate-reducer';
import paymentStatusReducer, { PaymentStatusState } from './payment-status-reducer';
import tenantReducer, { TenantState } from './tenant-reducer';

import { Modal } from '../types/modal';

export interface ApplicationState {
  apiTable: ApiTableState;
  boxes: Boxes;
  order: OrderState;
  user: UserState;
  spinner: SpinnerState;
  modal: Modal;
  appStatus: AppStatus;
  notifications: NotificationState;
  rent: RentsStatus;
  stock: StockStatus;
  gate: GateState;
  lang: LangStatus;
  paymentStatus: PaymentStatusState;
  tenant: TenantState;
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
  rent: rentReducer,
  stock: stockReducer,
  gate: gateReducer,
  paymentStatus: paymentStatusReducer,
  tenant: tenantReducer,
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

export default rootReducer;
