export type PaymentStatusState = {
  isPaid: boolean;
};

const initialState: PaymentStatusState = {
  isPaid: false,
};

export default (state: PaymentStatusState = initialState, action: any) => {
  switch (action.type) {
    case 'PAYMENT_STATUS_CHANGED':
      return { ...state, isPaid: action.payload };
    default:
      return state;
  }
};
