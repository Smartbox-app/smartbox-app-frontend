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
  }
};

export const payNotPaidRentForm = (rentId: string) => async (dispatch: any) => {
  dispatch({ type: 'LOADING', payload: true });
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(`${ApiService.url}rent/pay-not-paid-rent/${rentId}`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    console.log('data', data);
    dispatch(saveFrom(data));
  } finally {
    dispatch({ type: 'LOADING', payload: false });
  }
};
