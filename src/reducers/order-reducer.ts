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
  paymentId: string;
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

interface SentRentBoxRequestSuccess {
  type: 'SENT_RENT_BOX_REQUEST_SUCCESS';
  payload: string;
}

interface BoxGroup {
  type: 'FETCH_BOX_AVAILABILITY_SUCCESS';
  payload: BoxGroupAvailability[];
}

type Action = FormStepSuccess | FormGoNextStep | BoxGroup | SentRentBoxRequestSuccess;

const initialState = {
  formData: {
    durationInDays: 7,
    discount: 0,
    size: '',
    isFirstRent: true,
    dateStart: new Date(),
    dateEnd: addDays(new Date(), 7),
  },
  formStep: 1,
  paymentId: '',
  countedPrice: 0,
  boxGroup: [],
};

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'FORM_STEP_SUCCESS': {
      const newFormData: Form = { ...state.formData, ...action.payload };
      console.log('FORM_STEP_SUCCESS', action.payload, newFormData);
      const { calculate } = usePricing();

      if (newFormData.durationInDays !== 0) {
        const price = calculate(newFormData.durationInDays, 0, Number(newFormData.size), true);
        return {
          ...state,
          formData: newFormData,
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

    case 'SENT_RENT_BOX_REQUEST_SUCCESS': {
      return {
        ...state,
        paymentId: action.payload,
      };
    }

    default:
      return state;
  }
};
