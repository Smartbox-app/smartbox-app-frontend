import { RentBoxReq, UserRole, ExecutePaymentReq } from 'smartbox-types';
import ApiService from '../services/api-service';
import { history } from '../App';
import UserService from '../services/user-service';

export const UpdateFormData = (data: any) => ({ type: 'FORM_STEP_SUCCESS', payload: data });

export const FormGoNextStep = (data: number) => ({ type: 'FORM_GO_NEXT_STEP_SUCCESS', payload: data });

export const formAgreementReaded = () => ({ type: 'FORM_AGREEMENT_READED_SUCCESS' });

export const fetchBoxAvailability = () => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_BOX_AVAILABILITY_SUCCESS',
    'FETCH_BOX_AVAILABILITY_FAILED',
    null,
    null,
    'rent/box-group/availability',
  );
};

export const sentRentBoxRequest = (data: RentBoxReq, nextStep: number, role: UserRole) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'SENT_RENT_BOX_REQUEST_SUCCESS',
    'SENT_RENT_BOX_REQUEST_FAILED',
    (d: any) => {
      dispatch(FormGoNextStep(nextStep));
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
