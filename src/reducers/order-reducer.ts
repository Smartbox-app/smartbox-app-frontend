import { BoxGroupAvailability } from 'smartbox-types';

interface State {
  formData: {};
  formStep: number;
  countedPrice: number;
}

interface FormStepSuccess {
  type: 'FORM_STEP_SUCCESS';
  payload: any;
}

interface FormGoNextStep {
  type: 'FORM_GO_NEXT_STEP_SUCCESS';
  payload: any;
}

interface BoxGroup {
  type: 'FETCH_BOX_AVAILABILITY_SUCCESS';
  payload: BoxGroupAvailability[];
}

type Action = FormStepSuccess | FormGoNextStep | BoxGroup;

const initialState = {
  formData: {
    durationInDays: 0,
    discount: 0,
    size: 3,
    isFirstRent: true,
  },
  formStep: 1,
  countedPrice: 0,
  boxGroup: [],
};

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'FORM_STEP_SUCCESS': {
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
      };
    }

    case 'FORM_GO_NEXT_STEP_SUCCESS': {
      return {
        ...state,
        formStep: action.payload,
      };
    }

    default:
      return state;
  }
};
