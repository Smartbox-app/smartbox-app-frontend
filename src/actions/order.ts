import { RentBoxReq, UserRole, ExecutePaymentReq, ApiErrorCode } from 'smartbox-types';
import ApiService from '../services/api-service';
import { history } from '../App';
import SessionService from '../services/session-service';
import UserService from '../services/user-service';
import { auth } from './index';

export const updateFormData = (data: any) => ({ type: 'FORM_STEP_SUCCESS', payload: data });

export const formAgreementReaded = () => ({ type: 'FORM_AGREEMENT_READED_SUCCESS' });

export const formResignationMarked = () => ({ type: 'FORM_RESIGNATION_MARKED_SUCCESS' });

const saveBanks = (data: any) => ({ type: 'SAVE_BANKS_LIST', payload: data });

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

export const getBankList = () => async (dispatch: any) => {
  try {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/https://secure.tpay.com/groups-10100.js?json`, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });

    const data = await response.json();

    console.log('getBankList', data);
    dispatch(saveBanks(data));
  } catch (error) {
    console.log('error', error);
  }

  // await fetch(`https://cors-anywhere.herokuapp.com/https://secure.tpay.com/groups-10100.js?json`, {
  //   method: 'GET',
  //   mode: 'cors',
  //   headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  // })
  //   .then((res: any) => res.json())
  //   .then((data) => saveBanks(data));
};
