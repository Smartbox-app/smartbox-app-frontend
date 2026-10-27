import { PaymentDocument, PayForRentResponse, RentAgreementType, RentPaymentType, StockRes, BoxGroupType } from 'smartbox-types';
import { FormType } from 'src/types/order-form';

export const updateFormData = (data: Partial<FormType>) => ({
  type: 'FORM_STEP_SUCCESS',
  payload: data,
});

export const setDiscountCode = (code: string) => ({
  type: 'SET_DISCOUNT_CODE',
  payload: code,
});
export const resetDiscountCode = () => ({ type: 'RESET_DISCOUNT_CODE' });

export const formAgreementReaded = () => ({
  type: 'FORM_AGREEMENT_READED_SUCCESS',
});

export const formResignationMarked = () => ({
  type: 'FORM_RESIGNATION_MARKED_SUCCESS',
});

export const clearOrder = () => ({ type: 'CLEAR_ORDER' });

export const setPendingCheckout = (payload: PayForRentResponse | null) => ({
  type: 'SET_PENDING_CHECKOUT',
  payload,
});

export const clearPaymentDetails = () => ({
  type: 'CLEAR_PAYMENT_METHOD_SUCCESS',
});

// refactored
export const setOrderStock = (
  stockId: string,
  stockName: string,
  stockAddress: string,
) => ({
  type: 'SET_ORDER_STOCK',
  payload: { stockId, stockAddress, stockName },
});
export const setOrderFullStock = (stock: StockRes) => ({
  type: 'SET_ORDER_FULL_STOCK',
  payload: { stock },
});

export const clearSelectedStock = () => ({ type: 'CLEAR_ORDER_STOCK' });
export const setBoxGroup = (
  boxGroupId: string,
  boxGroupName: string,
  boxGroupArea: string,
  boxGroupType: BoxGroupType = BoxGroupType.storage,
) => ({
  type: 'SET_ORDER_BOX_GROUP',
  payload: { boxGroupId, boxGroupName, boxGroupArea, boxGroupType },
});
export const setMinRentPeriod = (days: number) => ({
  type: 'SET_MIN_RENT_PERIOD',
  payload: days,
});
export const setMaxRentPeriod = (days: number) => ({
  type: 'SET_MAX_RENT_PERIOD',
  payload: days,
});
export const setMaxAdvanceBookingDays = (days: number) => ({
  type: 'SET_MAX_ADVANCE_BOOKING_DAYS',
  payload: days,
});
export const setRentStartDate = (date: Date) => ({
  type: 'SET_RENT_START_DATE',
  payload: date,
});
export const setRentEndDate = (date: Date | null) => ({
  type: 'SET_RENT_END_DATE',
  payload: date,
});

export const setRentPaymentType = (paymentType: RentPaymentType) => ({
  type: 'SET_RENT_PAYMENT_TYPE',
  payload: paymentType,
});

export const setRentAgreementType = (agreementType: RentAgreementType) => ({
  type: 'SET_RENT_AGREEMENT_TYPE',
  payload: agreementType,
});

export const setRentPaymentDocumentType = (
  paymentType: PaymentDocument,
) => ({
  type: 'SET_RENT_PAYMENT_DOCUMENT_TYPE',
  payload: paymentType,
});

export const setMinDaysForInstallments = (days: number | null) => ({
  type: 'SET_MIN_DAYS_FOR_INSTALLMENTS',
  payload: days,
});

export const clearAddonPrice = (addonId: string) => ({
  type: 'CLEAR_ADDON_PRICE',
  payload: { addonId },
});

export const selectAddon = (
  addonId: string,
  variantId: string | null,
  variantName: string | null,
) => ({ type: 'SELECT_ADDON', payload: { addonId, variantId, variantName } });
export const setAddonAcceptance = (
  addonId: string,
  acceptanceId: string,
  checked: boolean,
) => ({
  type: 'SET_ADDON_ACCEPTANCE',
  payload: { addonId, acceptanceId, checked },
});
export const setAddonFile = (addonId: string, file: File | null) => ({
  type: 'SET_ADDON_FILE',
  payload: { addonId, file },
});

export const setBirthDate = (date: Date) => ({
  type: 'SET_BIRTHDATE',
  payload: date,
});
