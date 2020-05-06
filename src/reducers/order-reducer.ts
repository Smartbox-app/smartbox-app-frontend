import { addDays } from 'date-fns';
import { BoxGroupAvailability, usePricing } from 'smartbox-types';

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
    durationInDays: 13,
    discount: 0,
    size: '3',
    isFirstRent: true,
    dateStart: new Date(),
    dateEnd: addDays(new Date(), 13),
  },
  formStep: 1,
  countedPrice: 0,
  boxGroup: [],
};

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'FORM_STEP_SUCCESS': {
      const newFormData: Form = { ...state.formData, ...action.payload };
      const { calculate } = usePricing();

      if (newFormData.durationInDays !== 0) {
        const price = calculate(newFormData.durationInDays, 1, Number(newFormData.size), false);
        return {
          ...state,
          countedPrice: price,
        };
      }

      return {
        ...state,
        formData: newFormData,
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
