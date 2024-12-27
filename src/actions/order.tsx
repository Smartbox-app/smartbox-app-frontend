import {
  UserRole,
  PaymentStatus,
  RentPaymentType,
} from 'smartbox-types';
import ApiService from '../services/api-service';
import { history } from '../App';
import UserService from '../services/user-service';
import { FormType } from '../types/order-form';

export const updateFormData = (data: Partial<FormType>) => ({ type: 'FORM_STEP_SUCCESS', payload: data });

export const setDiscountCode = (code: string) => ({ type: 'SET_DISCOUNT_CODE', payload: code });
export const resetDiscountCode = () => ({ type: 'RESET_DISCOUNT_CODE' });

export const formAgreementReaded = () => ({ type: 'FORM_AGREEMENT_READED_SUCCESS' });

export const formResignationMarked = () => ({ type: 'FORM_RESIGNATION_MARKED_SUCCESS' });

export const clearOrder = () => ({ type: 'CLEAR_ORDER' });

export const sentRentBoxRequest = (data: FormData, nextStep: string, role: UserRole) => async (dispatch: any) => {
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

export const clearPaymentDetails = () => ({
  type: 'CLEAR_PAYMENT_METHOD_SUCCESS',
});

export const sentExtendRentRequest = (rentId: string, data: FormData, role: UserRole) => async (
  dispatch: any,
) => {
  await ApiService.post(
    dispatch,
    'SENT_EXTEND_RENT_SUCCESS',
    'SENT_EXTEND_RENT_FAILED',
    (result: { paymentId: string; status: PaymentStatus }) => {
      if (result.status === PaymentStatus.succes) {
        history.push(`/payment-success/${result.paymentId}`);
      } else {
        history.push(`/${UserService.getSlugByRole(role)}/order/step/payment/${result.paymentId}/${rentId}`);
      }
    },
    null,
    `rent/extend-rent/${rentId}`,
    'LOADING',
    data,
  );
};

// refactored
export const setOrderStock = (stockId: string, stockName: string, stockAddress: string) => ({ type: 'SET_ORDER_STOCK', payload: { stockId, stockAddress, stockName } });
export const setBoxGroup = (boxGroupId: string, boxGroupName: string) => ({ type: 'SET_ORDER_BOX_GROUP', payload: { boxGroupId, boxGroupName } });
export const setMinRentPeriod = (days: number) => ({ type: 'SET_MIN_RENT_PERIOD', payload: days });
export const setRentStartDate = (date: Date) => ({ type: 'SET_RENT_START_DATE', payload: date });
export const setRentEndDate = (date: Date) => ({ type: 'SET_RENT_END_DATE', payload: date });

export const setRentPaymentType = (paymentType: RentPaymentType) => ({ type: 'SET_RENT_PAYMENT_TYPE', payload: paymentType });

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

export const calculatePriceForRent = (rentId: string, start: Date, end: Date, code?: string) => async (
  dispatch: any,
) => {
  await ApiService.get(
    dispatch,
    'CALCULATE_RENT_PRICE_SUCCESS',
    'CALCULATE_RENT_PRICE_FAILED',
    null,
    null,
    `box-group-new/price-for-rent/${rentId}/${start.toISOString()}/${end.toISOString()}/${code || ''}`,
    'LOADING_PRICE',
  );
};

export const clearAddonPrice = (addonId: string) => ({ type: 'CLEAR_ADDON_PRICE', payload: { addonId } });

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


export const selectAddon = (addonId: string, variantId: string | null, variantName: string | null) => ({ type: 'SELECT_ADDON', payload: { addonId, variantId, variantName } })
export const setAddonAcceptance = (addonId: string, acceptanceId: string, checked: boolean) => ({ type: 'SET_ADDON_ACCEPTANCE', payload: { addonId, acceptanceId, checked } })
export const setAddonFile = (addonId: string, file: File | null) => ({ type: 'SET_ADDON_FILE', payload: { addonId, file } })

export const setBirthDate = (date: Date) => ({ type: 'SET_BIRTHDATE', payload: date })