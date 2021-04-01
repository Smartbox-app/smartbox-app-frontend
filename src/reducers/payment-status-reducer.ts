export type PaymentStatusState = {
  isPaid: boolean;
  func: any;
};

const initialState: PaymentStatusState = {
  isPaid: false,
  func: null,
};

export default (state: PaymentStatusState = initialState, action: any) => {
  switch (action.type) {
    case 'PAYMENT_STATUS_CHANGED':
      return { ...state, isPaid: action.payload };
    case 'GET_CREDIT_CARD_FORM_SUCCESS':
      return { ...state, func: action.payload };
    default:
      return state;
  }
};
