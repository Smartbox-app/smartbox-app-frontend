import { addDays } from 'date-fns';
import {
  AddonRes,
  BoxGroupAvailability,
  CalculatedAddonPriceRes,
  CalculatedPriceRes,
  PaymentStatus,
  PaymentType,
} from 'smartbox-types';
import { FormType } from '../types/order-form';
import { __ } from "../helpers/i18n";
import { v4 } from 'uuid';

export type PaymentMethodDetail = {
  id: string;
  name: string;
  img: string;
  banks: string;
  main_bank_id: string;
};

export type OrderAddon = {
  required: boolean;
  selectedVariant: string | null;
  accepted: boolean;
  acceptance?: string;
  price: { value: number, isGross: boolean } | null;
}

export type OrderState = {
  // refactored
  stockId: string;
  boxGroupId: string;
  minRentPeriod: number;
  startDate: Date;
  endDate: Date;
  calculatedPrice: { value: number, isGross: boolean },
  loadingPrice: boolean;
  discountCode: string;
  // for displaying
  addons: AddonRes[];
  // for manipulation like selecting, veryfing if selected etc
  orderAddons: {
    [addonId: string]: OrderAddon
  };
  // to control price refreshing - to know when something in the addons changed
  orderAddonsId: string;
  loadingAddons: boolean;
  // @TODO FIX
  calculatedPriceDetails: any[];
  //
  formData: FormType;
  paymentId: string;
  boxAvailability: BoxGroupAvailability[];
  discountList: any[];
  paymentSuccess: boolean;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  blikPaymentCompletedSuccessfully: boolean;
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

interface SetMinRentPeriod {
  type: 'SET_MIN_RENT_PERIOD';
  payload: number;
}

interface SetRentStartDate {
  type: 'SET_RENT_START_DATE';
  payload: Date;
}

interface SetRentEndDate {
  type: 'SET_RENT_END_DATE';
  payload: Date;
}

interface SetCalculatedPrice {
  type: 'CALCULATE_RENT_PRICE_SUCCESS';
  payload: CalculatedPriceRes;
}

interface SetCalculatedAddonPrice {
  type: 'CALCULATE_VARIANT_PRICE_SUCCESS';
  payload: CalculatedAddonPriceRes;
}

interface LoadingPrice {
  type: 'LOADING_PRICE';
  payload: boolean;
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

interface FetchAddons {
  type: 'FETCH_ADDONS_SUCCESS';
  payload: AddonRes[];
}

interface LoadingAddons {
  type: 'LOADING_ADDONS';
  payload: boolean;
}

interface SelectAddon {
  type: 'SELECT_ADDON';
  payload: { addonId: string, variantId: string | null }
}

interface SetAddonAcceptance {
  type: 'SET_ADDON_ACCEPTANCE';
  payload: { addonId: string, checked: boolean }
}

interface FormReaded {
  type: 'FORM_AGREEMENT_READED_SUCCESS';
}

interface FormResignation {
  type: 'FORM_RESIGNATION_MARKED_SUCCESS';
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

interface SetDiscountCode {
  type: 'SET_DISCOUNT_CODE';
  payload: string;
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
  | SetMinRentPeriod
  | SetRentStartDate
  | SetRentEndDate
  | SetCalculatedPrice
  | SetCalculatedAddonPrice
  | LoadingPrice
  | SetDiscountCode
  | LoadingAddons
  | SelectAddon
  | SetAddonAcceptance
  //
  | FormStepSuccess
  | FetchBoxAvailability
  | SentRentBoxRequestSuccess
  | FormReaded
  | FormResignation
  | PickPaymentMethod
  | CheckPaymentStatus
  | ClearPaymentMethodSuccess
  | SentExtendRentRequestSuccess
  | ClearOrderFormAgreementSuccess
  | ClearOrder
  | FetchAddons
  | ResetDiscountCode
  | BlikPaymentFinishSuccess


const initialState: OrderState = {
  // refactored
  stockId: '',
  boxGroupId: '',
  minRentPeriod: 7,
  startDate: new Date(),
  endDate: addDays(new Date(), 7),
  calculatedPrice: { value: 0, isGross: false },
  calculatedPriceDetails: [],
  loadingPrice: false,
  discountCode: '',
  addons: [],
  orderAddons: {},
  loadingAddons: false,
  orderAddonsId: '',
  //
  formData: {
    durationInDays: 7,
    discount: 0,
    stock: '',
    size: null,
    isFirstRent: true,
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
  boxAvailability: [],
  discountList: [{ text: __('application.disposableDiscount5'), value: 5 }],
  isAgreementAccepted: false,
  isResignationMarked: false,
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

    case 'SET_MIN_RENT_PERIOD': {
      return {
        ...state,
        minRentPeriod: action.payload
      }
    };


    case 'SET_RENT_START_DATE': {
      console.log('SETTING START DATE', action.payload);
      return {
        ...state,
        startDate: action.payload
      }
    };

    case 'SET_RENT_END_DATE': {
      console.log('SETTING END DATE', action.payload);
      return {
        ...state,
        endDate: action.payload
      }
    };

    case 'CALCULATE_RENT_PRICE_SUCCESS': {
      return {
        ...state,
        calculatedPrice: action.payload.price,
        calculatedPriceDetails: action.payload.details,
      }
    }

    case 'CALCULATE_VARIANT_PRICE_SUCCESS': {
      const { addonId, variantId, price } = action.payload;

      if (!state.orderAddons[addonId] || state.orderAddons[addonId].selectedVariant !== variantId) return state;

      return {
        ...state,
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            price
          }
        }
      }
    }

    case 'LOADING_PRICE': {
      return {
        ...state,
        loadingPrice: action.payload
      }
    }

    case 'LOADING_ADDONS': {
      return {
        ...state,
        loadingAddons: action.payload
      }
    }

    case 'FORM_STEP_SUCCESS': {
      const newFormData: FormType = { ...state.formData, ...action.payload };
      // const { calculate } = usePricing();


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
        discountCode: '',
      };
    }

    case 'SET_DISCOUNT_CODE': {
      return {
        ...state,
        discountCode: action.payload,
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

    case 'FETCH_ADDONS_SUCCESS': {
      const orderAddons: { [addonId: string]: OrderAddon } = {};

      action.payload.forEach(addon => {
        orderAddons[addon.id] = {
          required: addon.required,
          acceptance: addon.acceptance,
          accepted: false,
          selectedVariant: null,
          price: null,
        }
      })
      return {
        ...state,
        addons: action.payload,
        orderAddons
      };
    }

    case 'SELECT_ADDON': {
      const { addonId, variantId } = action.payload;
      if (!state.orderAddons[addonId]) return state;
      return {
        ...state,
        orderAddonsId: v4(),
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            selectedVariant: variantId
          }
        }
      }
    }
    case 'SET_ADDON_ACCEPTANCE': {
      const { addonId, checked } = action.payload;
      console.log('SETTING ACCEPTANCE', addonId, checked);
      if (!state.orderAddons[addonId]) return state;
      return {
        ...state,
        orderAddonsId: v4(),
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            accepted: checked
          }
        }
      }
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


    case 'PICK_PAYMENT_TYPE_SUCCESS':
      console.log('PICKING PAYMENT TYPE', action.payload);
      return {
        ...state,
        // @TODO fix
        selectedPayment: action.payload as any,
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
