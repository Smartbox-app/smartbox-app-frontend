interface State {
  formData: {};
}

interface FormStepSuccess {
  type: 'FORM_STEP_SUCCESS';
  payload: any;
}

type Action = FormStepSuccess;

const initialState = {
  formData: {
    durationInDays: 0,
    discount: 0,
    size: 3,
    isFirstRent: true,
  },
};

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'FORM_STEP_SUCCESS': {
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    }
    default:
      return state;
  }
};
