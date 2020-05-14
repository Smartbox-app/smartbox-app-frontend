import { RentBoxReq } from 'smartbox-types';
import ApiService from '../services/api-service';

export const UpdateFormData = (data: any) => ({ type: 'FORM_STEP_SUCCESS', payload: data });

export const FormGoNextStep = (data: number) => ({ type: 'FORM_GO_NEXT_STEP_SUCCESS', payload: data });

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

export const sentRentBoxRequest = (data: RentBoxReq) => async (dispatch: any) => {
  await ApiService.post(
    dispatch,
    'SENT_RENT_BOX_REQUEST_SUCCESS',
    'SENT_RENT_BOX_REQUEST_FAILED',
    (data: any) => console.log('SEND_RENT_BOX_REQUEST_SUCCESS', data),
    null,
    'rent/new',
    'LOADING',
    data,
  );
};
