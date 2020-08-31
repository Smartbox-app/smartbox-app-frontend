import { RentBoxReq, UserRole, ExecutePaymentReq } from 'smartbox-types';
import ApiService from '../services/api-service';
import { history } from '../App';
import UserService from '../services/user-service';

export const updateFormData = (data: any) => ({ type: 'FORM_STEP_SUCCESS', payload: data });

export const formAgreementReaded = () => ({ type: 'FORM_AGREEMENT_READED_SUCCESS' });

export const formResignationMarked = () => ({ type: 'FORM_RESIGNATION_MARKED_SUCCESS' });

export const saveBanks = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'SAVE_BANKS_LIST_SUCCESS', 'SAVE_BANKS_LIST_FAILED', null, null, 'payment/bank-list');
};

export const fetchBoxAvailability = (stockId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_BOX_AVAILABILITY_SUCCESS',
    'FETCH_BOX_AVAILABILITY_FAILED',
    null,
    null,
    `rent/box-group/availability/${stockId}`,
  );
};

export const sentRentBoxRequest = (data: RentBoxReq, nextStep: string, role: UserRole) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'SENT_RENT_BOX_REQUEST_SUCCESS',
    'SENT_RENT_BOX_REQUEST_FAILED',
    () => {
      history.push(`/${UserService.getSlugByRole(role)}/order/step/${nextStep}`);
    },
    null,
    'rent/new',
    'LOADING',
    data,
  );
};

export const sentExecutePaymentRequest = (data: ExecutePaymentReq) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'SENT_EXECUTE_PAYMENT_REQUEST_SUCCESS',
    'SENT_EXECUTE_PAYMENT_REQUEST_FAILED',
    null,
    null,
    'rent/execute-payment/true',
    'LOADING',
    data,
  );
};

export const sentExecutePaymentWithBlikRequest = (data: ExecutePaymentReq) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'SENT_EXECUTE_PAYMENT_WITH_BLIK_REQUEST_SUCCESS',
    'SENT_EXECUTE_PAYMENT_WITH_BLIK_REQUEST_FAILED',
    null,
    null,
    'rent/execute-payment-with-blik',
    'LOADING',
    data,
  );
};

export const setPaymentMethod = (paymentId: string) => ({ type: 'SET_PAYMENT_METHOD_SUCCESS', payload: paymentId });
