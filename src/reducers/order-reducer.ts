import { addDays } from 'date-fns';
import {
  BoxGroupAvailability,
  ICalculateProps,
  IPricingResult,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  usePricing,
} from 'smartbox-types';
import { FormType } from '../types/order-form';
import { __ } from "../helpers/i18n";

export type PaymentMethodDetail = {
  id: string;
  name: string;
  img: string;
  banks: string;
  main_bank_id: string;
};

export type OrderState = {
  // refactored
  stockId: string;
  boxGroupId: string;
  //
  formData: FormType;
  paymentId: string;
  countedPrice: IPricingResult;
  boxAvailability: BoxGroupAvailability[];
  discountList: any[];
  paymentSuccess: boolean;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  blikPaymentCompletedSuccessfully: boolean;
  bankList: any;
  selectedPayment: PaymentType;
  selectedPaymentMethodDetail: PaymentMethodDetail;
};

interface SetOrderStock {
  type: 'SET_ORDER_STOCK';
  payload: string;
}

interface SetOrderBoxGroup {
  type: 'SET_ORDER_BOX_GROUP';
  payload: string;
}

interface FormStepSuccess {
  type: 'FORM_STEP_SUCCESS';
  payload: Partial<FormType>;
}

interface SentRentBoxRequestSuccess {
  type: 'SENT_RENT_BOX_REQUEST_SUCCESS';
  payload: {
    paymentId: string;
    status: PaymentStatus;
  };
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
  payload: PaymentMethodDetail | PaymentType;
}

interface PickPaymentMethod {
  type: 'PICK_PAYMENT_TYPE_SUCCESS';
  payload: PaymentMethodDetail;
}

interface CheckPaymentStatus {
  type: 'CHECK_PAYMENT_STATUS_SUCCESS';
  payload: boolean;
}

interface BlikPaymentFinishSuccess {
  type: 'BLIK_PAYMENT_FINISH_SUCCESS';
}

interface ClearPaymentMethodSuccess {
  type: 'CLEAR_PAYMENT_METHOD_SUCCESS';
}

interface SentExtendRentRequestSuccess {
  type: 'SENT_EXTEND_RENT_SUCCESS';
  payload: string;
}

interface ResetDiscountCode {
  type: 'RESET_DISCOUNT_CODE';
}

interface ClearOrder {
  type: 'CLEAR_ORDER';
}

interface ClearOrderFormAgreementSuccess {
  type: 'CLEAR_ORDER_FORM_AGREEMENT_SUCCESS';
}

type Action =
  // refactored
  | SetOrderStock
  | SetOrderBoxGroup
  //
  | FormStepSuccess
  | FetchBoxAvailability
  | SentRentBoxRequestSuccess
  | FormReaded
  | FormResignation
  | SetPaymentMethod
  | PickPaymentMethod
  | CheckPaymentStatus
  | SaveBankList
  | ClearPaymentMethodSuccess
  | SentExtendRentRequestSuccess
  | ClearOrderFormAgreementSuccess
  | ClearOrder
  | ResetDiscountCode
  | BlikPaymentFinishSuccess;

const initialState: OrderState = {
  // refactored
  stockId: '',
  boxGroupId: '',
  //
  formData: {
    durationInDays: 7,
    discount: 0,
    stock: '',
    size: null,
    isFirstRent: true,
    dateStart: new Date(),
    dateEnd: addDays(new Date(), 7),
    discountCode: '',
    card: {
      discount: 0,
      durationInWeeks: 0,
    },
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    postCode: '',
    phone: '',
    mailToSendInvoice: '',
  },
  paymentId: '',
  paymentSuccess: false,
  countedPrice: {
    name: '',
    value: 0,
  },
  boxAvailability: [],
  discountList: [{ text: __('application.disposableDiscount5'), value: 5 }],
  isAgreementAccepted: false,
  isResignationMarked: false,
  bankList: [],
  selectedPayment: PaymentType.card,
  selectedPaymentMethodDetail: {
    id: '',
    name: '',
    img: '',
    banks: '',
    main_bank_id: '',
  },
  blikPaymentCompletedSuccessfully: false,
};

export default (state: OrderState = initialState, action: Action): OrderState => {
  switch (action.type) {
    case 'SET_ORDER_STOCK': {
      return {
        ...state,
        stockId: action.payload,
      }
    };

    case 'SET_ORDER_BOX_GROUP': {
      return {
        ...state,
        boxGroupId: action.payload,
      }
    };
    case 'FORM_STEP_SUCCESS': {
      const newFormData: FormType = { ...state.formData, ...action.payload };
      // const { calculate } = usePricing();

      const data: ICalculateProps = {
        durationInDays: newFormData.durationInDays,
        discount: newFormData.discount,
        size: Number(newFormData.size),
        isFirstRent: newFormData.isFirstRent,
        card: {
          discount: newFormData.card.discount,
          durationInWeeks: newFormData.card.durationInWeeks,
        },
      };

      if (newFormData.durationInDays !== 0) {
        // const price = calculate(data);
        // const price =
        // return {
        //   ...state,
        //   formData: newFormData,
        //   countedPrice: price,
        //   discountList: [
        //     {
        //       text: price.name,
        //       value: 0,
        //     },
        //   ],
        // };
      }

      return {
        ...state,
        formData: newFormData,
      };
    }

    case 'RESET_DISCOUNT_CODE': {
      const newFormData: FormType = { ...state.formData, discountCode: '' };
      return {
        ...state,
        formData: newFormData,
      };
    }

    case 'SENT_RENT_BOX_REQUEST_SUCCESS': {
      return {
        ...state,
        paymentId: action.payload.paymentId,
      };
    }
    case 'SENT_EXTEND_RENT_SUCCESS': {
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

    case 'PICK_PAYMENT_TYPE_SUCCESS':
      return {
        ...state,
        // @TODO fix
        selectedPayment: action.payload as any,
      };

    case 'SET_PAYMENT_METHOD_SUCCESS':
      return {
        ...state,
        selectedPaymentMethodDetail: state.bankList.find((singleBank: any) => singleBank.id === action.payload),
      };

    case 'CLEAR_PAYMENT_METHOD_SUCCESS':
      return {
        ...state,
        selectedPayment: PaymentType.card,
        isResignationMarked: false,
        selectedPaymentMethodDetail: {
          id: '',
          name: '',
          img: '',
          banks: '',
          main_bank_id: '',
        },
      };

    case 'BLIK_PAYMENT_FINISH_SUCCESS':
      return {
        ...state,
        blikPaymentCompletedSuccessfully: true,
      };

    case 'CLEAR_ORDER': {
      return initialState;
    }

    case 'CLEAR_ORDER_FORM_AGREEMENT_SUCCESS':
      return {
        ...state,
        isAgreementAccepted: true,
        isResignationMarked: false,
        paymentId: '',
        paymentSuccess: false,
        selectedPayment: PaymentType.card,
        formData: {
          durationInDays: 7,
          discount: 0,
          size: state.formData.size,
          isFirstRent: true,
          dateStart: new Date(),
          dateEnd: addDays(new Date(), 7),
          discountCode: '',
          card: {
            discount: 0,
            durationInWeeks: 0,
          },
          firstName: '',
          lastName: '',
          street: '',
          city: '',
          postCode: '',
          phone: '',
          mailToSendInvoice: '',
          stock: ''
        },
      };

    default:
      return state;
  }
};
