import { addDays } from 'date-fns';
import { BoxGroupAvailability, usePricing, ICalculateProps } from 'smartbox-types';

export interface Form {
  durationInDays: number;
  discount: number;
  size: string;
  isFirstRent: boolean;
  dateStart: Date;
  dateEnd: Date;
}
export type OrderState = {
  formData: Form;
  formStep: number;
  paymentId: string;
  countedPrice: number;
  boxAvailability: BoxGroupAvailability[];
  discountList: any[];
  isAgreementAccepted: boolean;
};

interface FormStepSuccess {
  type: 'FORM_STEP_SUCCESS';
  payload: any;
}

interface FormGoNextStep {
  type: 'FORM_GO_NEXT_STEP_SUCCESS';
  payload: number;
}

interface SentRentBoxRequestSuccess {
  type: 'SENT_RENT_BOX_REQUEST_SUCCESS';
  payload: string;
}

interface FetchBoxAvailability {
  type: 'FETCH_BOX_AVAILABILITY_SUCCESS';
  payload: BoxGroupAvailability[];
}

interface FormReaded {
  type: 'FORM_AGREEMENT_READED_SUCCESS';
}

type Action = FormStepSuccess | FormGoNextStep | FetchBoxAvailability | SentRentBoxRequestSuccess | FormReaded;

const initialState: OrderState = {
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
  boxAvailability: [],
  discountList: [
    { text: 'Jednorazowy rabat 5%', value: 5 },
    { text: 'Jednorazowy rabat 10%', value: 10 },
  ],
  isAgreementAccepted: false,
};

export default (state: OrderState = initialState, action: Action): any => {
  switch (action.type) {
    case 'FORM_STEP_SUCCESS': {
      const newFormData: Form = { ...state.formData, ...action.payload };

      const { calculate } = usePricing();

      const data: ICalculateProps = {
        durationInDays: newFormData.durationInDays,
        discount: 0,
        size: Number(newFormData.size),
        isFirstRent: false,
      };

      if (newFormData.durationInDays !== 0) {
        const price = calculate(data);
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

    case 'FETCH_BOX_AVAILABILITY_SUCCESS': {
      return {
        ...state,
        boxAvailability: action.payload,
      };
    }
    case 'FORM_AGREEMENT_READED_SUCCESS': {
      return {
        ...state,
        isAgreementAccepted: true,
      };
    }
    default:
      return state;
  }
};
