import { RentBoxReq, UserRole, ExecutePaymentReq, ExecuteBlikPaymentReq, UrlRes } from 'smartbox-types';
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

export const sentExecutePaymentRequest = (data: ExecutePaymentReq, develop = false) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'SENT_EXECUTE_PAYMENT_REQUEST_SUCCESS',
    'SENT_EXECUTE_PAYMENT_REQUEST_FAILED',
    null,
    null,
    develop ? 'rent/execute-payment/true' : 'rent/execute-payment',
    'LOADING',
    data,
  );
};

export const sentExecutePaymentWithBlikRequest = (data: ExecuteBlikPaymentReq) => async (dispatch: any) => {
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
export const pickPaymentType = (paymentId: string) => ({ type: 'PICK_PAYMENT_TYPE_SUCCESS', payload: paymentId });
export const blikPaymentFinishSuccess = (paymentId: string) => ({ type: 'BLIK_PAYMENT_FINISH_SUCCESS' });

export const checkPaymentStatus = (paymentId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'CHECK_PAYMENT_STATUS_SUCCESS',
    'CHECK_PAYMENT_STATUS_FAILED',
    (data: boolean) => {
      console.log('checkPaymentStatus', data);
      if (data) {
        blikPaymentFinishSuccess(paymentId);
      }
    },
    null,
    `payment/is-paid/${paymentId}`,
  );
};

export const sentExecutePaymentWithTpayRequest = (paymentId: string, group: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'SENT_EXECUTE_PAYMENT_WITH_TPAY_REQUEST_SUCCESS',
    'SENT_EXECUTE_PAYMENT_WITH_TPAY_REQUEST_FAILED',
    (res: UrlRes) => {
      console.log('res: UrlRes', res);
      // przesłać usera na wskazany url
    },
    null,
    `rent/execut-payment-with-tpay/${paymentId}/${group}`,
  );
};
