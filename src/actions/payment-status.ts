import ApiService from '../services/api-service';

export const paymentStatusChanged = (isPaid: boolean) => ({ type: 'PAYMENT_STATUS_CHANGED', payload: isPaid });
export const saveFrom = (d: any) => ({ type: 'GET_CREDIT_CARD_FORM_SUCCESS', payload: d });

export const getCardForm = (paymentId: string) => async (dispatch: any) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${ApiService.url}rent/execute-payment-with-payu/${paymentId}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.text();
    dispatch(saveFrom(data));
  } finally {
    // console.log('body', data);
    // console.log('text', data.text());
    // console.log('data', typeof data);
  }
};
