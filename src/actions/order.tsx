import React from 'react';
import {
  RentBoxReq,
  UserRole,
  ExecutePaymentReq,
  ExecuteBlikPaymentReq,
  UrlRes,
  ApiErrorCode,
  ExtendRentalReq,
  PaymentStatus,
} from 'smartbox-types';
import ApiService from '../services/api-service';
import { history } from '../App';
import UserService from '../services/user-service';
import BlikWaitingModal from '../views/DashboardCommon/Order/Form/StepPayment/BlikForm/BlikWaitingModal';
import { modal, notifications, singleRent, user, paymentStatus } from './index';
import { saveFrom } from './payment-status';
import { FormType } from '../types/order-form';

export const updateFormData = (data: Partial<FormType>) => ({ type: 'FORM_STEP_SUCCESS', payload: data });

export const setDiscountCode = (code: string) => ({ type: 'SET_DISCOUNT_CODE', payload: code });
export const resetDiscountCode = () => ({ type: 'RESET_DISCOUNT_CODE' });

export const formAgreementReaded = () => ({ type: 'FORM_AGREEMENT_READED_SUCCESS' });

export const formResignationMarked = () => ({ type: 'FORM_RESIGNATION_MARKED_SUCCESS' });

export const clearOrderAgreement = () => ({ type: 'CLEAR_ORDER_FORM_AGREEMENT_SUCCESS' });
export const clearOrder = () => ({ type: 'CLEAR_ORDER' });

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
    (result: { paymentId: string; status: PaymentStatus }) => {
      if (result.status === PaymentStatus.succes) {
        history.push(`/payment-success/${result.paymentId}`);
      } else {
        history.push(`/${UserService.getSlugByRole(role)}/order/step/${nextStep}/${result.paymentId}`);
      }
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

export const checkIfStockIsRented = (paymentId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'CHECK_STOCK_STATUS_SUCCESS',
    'CHECK_STOCK_STATUS_FAILED',
    (data: boolean) => {
      if (data) {
        dispatch(singleRent.getMyRentList());
        dispatch(singleRent.fetchMyRentHistory());
        dispatch(user.fetchMyData());
        dispatch(paymentStatus.paymentStatusChanged(data));
      }
    },
    null,
    `payment/is-paid/${paymentId}`,
  );
};

export const sentExecutePaymentWithTpayRequest = (paymentId: string, group = '0') => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'SENT_EXECUTE_PAYMENT_WITH_TPAY_REQUEST_SUCCESS',
    'SENT_EXECUTE_PAYMENT_WITH_TPAY_REQUEST_FAILED',
    (res: UrlRes | any) => {
      // const win = window.open(res.html);
      // win?.focus();
      dispatch(saveFrom(res.html));
    },
    null,
    `rent/execut-payment-with-tpay/${paymentId}/114`,
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
      history.push(`/${UserService.getSlugByRole(role)}/order/step/payment/${rentId}`);
    },
    null,
    `rent/extend-rent/${rentId}`,
    'LOADING',
    data,
  );
};

// refactored
export const setOrderStock = (stockId: string) => ({ type: 'SET_ORDER_STOCK', payload: stockId });
export const setBoxGroup = (boxGroupId: string) => ({ type: 'SET_ORDER_BOX_GROUP', payload: boxGroupId });
export const setMinRentPeriod = (days: number) => ({ type: 'SET_MIN_RENT_PERIOD', payload: days });
export const setRentStartDate = (days: number) => ({ type: 'SET_RENT_START_DATE', payload: days });
export const setRentEndDate = (days: number) => ({ type: 'SET_RENT_END_DATE', payload: days });

export const calculatePrice = (boxGroupId: string, start: Date, end: Date, code?: string) => async (
  dispatch: any,
) => {
  await ApiService.get(
    dispatch,
    'CALCULATE_RENT_PRICE_SUCCESS',
    'CALCULATE_RENT_PRICE_FAILED',
    null,
    null,
    `box-group-new/price/${boxGroupId}/${start.toISOString()}/${end.toISOString()}/${code || ''}`,
    'LOADING_PRICE',
  );
};

export const calculateAddonPrice = (addonId: string, start: Date, end: Date, variantId: string) => async (
  dispatch: any,
) => {
  await ApiService.get(
    dispatch,
    'CALCULATE_VARIANT_PRICE_SUCCESS',
    'CALCULATE_VARIANT_PRICE_FAILED',
    null,
    null,
    `addon/price/${addonId}/${start.toISOString()}/${end.toISOString()}/${variantId}`,
    'LOADING_VARIANT_PRICE',
  );
};

export const fetchAddons = (stockId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_ADDONS_SUCCESS',
    'FETCH_ADDONS_FAILED',
    null,
    null,
    `addon/all/${stockId}`,
    'LOADING_ADDONS'
  );
};


export const selectAddon = (addonId: string, variantId: string | null) => ({ type: 'SELECT_ADDON', payload: { addonId, variantId } })