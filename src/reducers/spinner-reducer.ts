export type SpinnerState = {
  loading: boolean;
};

const initialState: SpinnerState = {
  loading: false,
};

export default (state: SpinnerState = initialState, action: { type: string; payload?: boolean }): SpinnerState => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: action.payload ?? false };
    default:
      return state;
  }
};
