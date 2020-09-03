export type SpinnerState = {
  loading: boolean;
};

const initialState: SpinnerState = {
  loading: false,
};

export default (state: SpinnerState = initialState, action: any) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
