import { addDays } from 'date-fns';
import { BoxGroupAvailability } from 'smartbox-types';

export interface Form {
  durationInDays: number;
  discount: number;
  size: string;
  isFirstRent: boolean;
  dateStart: Date;
  dateEnd: Date;
}
interface State {
  formData: Form;
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
    size: '3',
    isFirstRent: true,
    dateStart: new Date(),
    dateEnd: addDays(new Date(), 14),
  },
  formStep: 1,
  countedPrice: 0,
  boxGroup: [],
};

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'FORM_STEP_SUCCESS': {
      console.log('FORM_STEP_SUCCESS', { ...state.formData, ...action.payload });
      console.log('action.payload', { ...action.payload });
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
