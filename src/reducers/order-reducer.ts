import { addDays } from 'date-fns';
import { BoxGroupAvailability, usePricing, ICalculateProps, IPricingResult } from 'smartbox-types';
import { FormType } from '../types/order-form';

export enum MainPaymentWay {
  'card',
  'blik',
  'other',
}

export type PaymentMethodDetail = {
  id: string;
  name: string;
  img: string;
};

export type OrderState = {
  formData: FormType;
  paymentId: string;
  countedPrice: IPricingResult;
  boxAvailability: BoxGroupAvailability[];
  discountList: any[];
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  bankList: any;
  selectedPayment: MainPaymentWay;
  selectedPaymentMethodDetail: PaymentMethodDetail;
};

interface FormStepSuccess {
  type: 'FORM_STEP_SUCCESS';
  payload: any;
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

interface FormResignation {
  type: 'FORM_RESIGNATION_MARKED_SUCCESS';
}

interface SaveBankList {
  type: 'SAVE_BANKS_LIST_SUCCESS';
  payload: any;
}

interface SetPaymentMethod {
  type: 'SET_PAYMENT_METHOD_SUCCESS';
  payload: PaymentMethodDetail | MainPaymentWay;
}

type Action =
  | FormStepSuccess
  | FetchBoxAvailability
  | SentRentBoxRequestSuccess
  | FormReaded
  | FormResignation
  | SetPaymentMethod
  | SaveBankList;

const initialState: OrderState = {
  formData: {
    durationInDays: 7,
    discount: 0,
    size: '',
    isFirstRent: true,
    dateStart: new Date(),
    dateEnd: addDays(new Date(), 7),
    discountCode: '',
  },
  paymentId: '',
  countedPrice: {
    name: '',
    value: 0,
  },
  boxAvailability: [],
  discountList: [{ text: 'Jednorazowy rabat 5%', value: 5 }],
  isAgreementAccepted: false,
  isResignationMarked: false,
  bankList: [],
  selectedPayment: MainPaymentWay.card,
  selectedPaymentMethodDetail: {
    id: '',
    name: '',
    img: '',
  },
};

export default (state: OrderState = initialState, action: Action): any => {
  switch (action.type) {
    case 'FORM_STEP_SUCCESS': {
      const newFormData: FormType = { ...state.formData, ...action.payload };

      const { calculate } = usePricing();

      const data: ICalculateProps = {
        durationInDays: newFormData.durationInDays,
        discount: newFormData.discount,
        size: Number(newFormData.size),
        isFirstRent: false,
      };

      if (newFormData.durationInDays !== 0) {
        const price = calculate(data);
        return {
          ...state,
          formData: newFormData,
          countedPrice: price,
          discountList: [
            {
              text: price.name,
              value: 0,
            },
          ],
        };
      }

      return {
        ...state,
        formData: newFormData,
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
    case 'FORM_RESIGNATION_MARKED_SUCCESS': {
      return {
        ...state,
        isResignationMarked: !state.isResignationMarked,
      };
    }
    case 'SAVE_BANKS_LIST_SUCCESS':
      const dataToRender: any[] = [];
      for (const bank in action.payload) {
        dataToRender.push(action.payload[bank]);
      }
      return {
        ...state,
        bankList: dataToRender,
      };
    case 'SET_PAYMENT_METHOD_SUCCESS':
      return {
        ...state,
        selectedPaymentMethodDetail: state.bankList.find((singleBank: any) => singleBank.id === action.payload),
      };

    default:
      return state;
  }
};
