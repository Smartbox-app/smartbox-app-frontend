import React from 'react';
import {
  RentBoxReq,
  UserRole,
  ExecutePaymentReq,
  ExecuteBlikPaymentReq,
  UrlRes,
  ApiErrorCode,
  ExtendRentalReq,
} from 'smartbox-types';
import ApiService from '../services/api-service';
import { history } from '../App';
import UserService from '../services/user-service';
import BlikWaitingModal from '../views/DashboardCommon/Order/Form/StepPayment/BlikForm/BlikWaitingModal';
import { modal, notifications } from './index';

export const updateFormData = (data: any) => ({ type: 'FORM_STEP_SUCCESS', payload: data });

export const formAgreementReaded = () => ({ type: 'FORM_AGREEMENT_READED_SUCCESS' });

export const formResignationMarked = () => ({ type: 'FORM_RESIGNATION_MARKED_SUCCESS' });

export const clearOrderAgreement = () => ({ type: 'CLEAR_ORDER_FORM_AGREEMENT_SUCCESS' });

export const saveBanks = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'SAVE_BANKS_LIST_SUCCESS', 'SAVE_BANKS_LIST_FAILED', null, null, 'payment/bank-list');
};

export const fetchBoxAvailability = (stockId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_BOX_AVAILABILITY_SUCCESS',
    'FETCH_BOX_AVAILABILITY_FAILED',
    null,
    () => {
      history.push('/');
    },
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
    () => {
      dispatch(modal.showModal(<BlikWaitingModal />, false));
    },
    () => {
      dispatch(notifications.errorNotification(ApiErrorCode.InvalidBlik));
      dispatch(modal.hideModal());
    },
    'rent/execute-payment-with-blik',
    'LOADING',
    data,
  );
};

export const setPaymentMethod = (paymentId: string) => ({ type: 'SET_PAYMENT_METHOD_SUCCESS', payload: paymentId });
export const pickPaymentType = (paymentId: string) => ({ type: 'PICK_PAYMENT_TYPE_SUCCESS', payload: paymentId });
export const blikPaymentFinishSuccess = () => ({ type: 'BLIK_PAYMENT_FINISH_SUCCESS' });

export const checkPaymentStatus = (paymentId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'CHECK_PAYMENT_STATUS_SUCCESS',
    'CHECK_PAYMENT_STATUS_FAILED',
    (data: boolean) => {
      if (data) {
        dispatch({ type: 'REFRESH_API_TABLE' });
        dispatch(blikPaymentFinishSuccess());
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
      // const win = window.open(res.url, '_blank');
      const win = window.open(res.url, '_self');
      win?.focus();
      // history.push('/');
    },
    null,
    `rent/execut-payment-with-tpay/${paymentId}/${group}`,
  );
};

export const clearPaymentDetails = () => ({
  type: 'CLEAR_PAYMENT_METHOD_SUCCESS',
});

export const sentExtendRentRequest = (rentId: string, data: ExtendRentalReq, role: UserRole) => async (
  dispatch: any,
) => {
  await ApiService.post(
    dispatch,
    'SENT_EXTEND_RENT_SUCCESS',
    'SENT_EXTEND_RENT_FAILED',
    (suc: any) => {
      console.log('suc', suc);
      history.push(`/${UserService.getSlugByRole(role)}/order/step/payment/${rentId}`);
    },
    null,
    `rent/extend-rent/${rentId}`,
    'LOADING',
    data,
  );
};
