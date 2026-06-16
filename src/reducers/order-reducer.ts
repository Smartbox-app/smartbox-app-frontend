import {
  AcceptanceStatuses,
  AddonRes,
  AddonUserFileRequirementType,
  CalculatedAddonPriceRes,
  CalculatedPriceRes,
  IStock,
  PaymentDocument,
  PriceDisplayForClients,
  RentPaymentType,
  SingleAcceptance,
  StockRes,
} from 'smartbox-types';
import { FormType } from '../types/order-form';
import { __ } from '../helpers/i18n';
import { v4 } from 'uuid';

export type PaymentMethodDetail = {
  id: string;
  name: string;
  img: string;
  banks: string;
  main_bank_id: string;
};

export type OrderAddon = {
  name: string;
  slug: string;
  required: boolean;
  selectedVariant: string | null;
  selectedVariantName: string | null;
  acceptancesStatus: AcceptanceStatuses;
  acceptances: SingleAcceptance[];
  userFileAllowed: boolean;
  noPricing: boolean;
  userFileRequirement: AddonUserFileRequirementType | null;
  price: { value: number; isGross: boolean, netPrice: number, grossPrice: number, display: PriceDisplayForClients }[] | null;
  file: File | null;
  tax: string;
};

export type OrderState = {
  // refactored
  stock: StockRes | null;
  stockId: string;
  stockName: string;
  stockAddress: string;
  boxGroupId: string;
  boxGroupName: string;
  boxGroupArea: string;
  minRentPeriod: number | null;
  maxAdvanceBookingDays: number | null;
  maxRentPeriod: number | null;
  startDate: Date;
  endDate: Date | null;
  calculatedPrice: { value: number; isGross: boolean, netPrice: number, grossPrice: number, display: PriceDisplayForClients }[];
  loadingPrice: boolean;
  discountCode: string;
  // for displaying
  addons: AddonRes[];
  // for manipulation like selecting, veryfing if selected etc
  orderAddons: {
    [addonId: string]: OrderAddon;
  };
  // to control price refreshing - to know when something in the addons changed
  orderAddonsId: string;
  loadingAddons: boolean;
  rentPaymentType: RentPaymentType | null;
  paymentDocumentType: PaymentDocument | null;

  minRentDaysForInstallments: number | null;
  // @TODO FIX
  calculatedPriceDetails: any[];
  //
  formData: FormType;
  paymentId: string;
  discountList: any[];
  paymentSuccess: boolean;
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
};

interface SetOrderStock {
  type: 'SET_ORDER_STOCK';
  payload: {
    stockId: string;
    stockName: string;
    stockAddress: string;
  };
}

interface SetOrderFullStock {
  type: 'SET_ORDER_FULL_STOCK';
  payload: {
    stock: StockRes;
  };
}

interface ClearOrderStock {
  type: 'CLEAR_ORDER_STOCK';
}

interface SetOrderBoxGroup {
  type: 'SET_ORDER_BOX_GROUP';
  payload: {
    boxGroupId: string;
    boxGroupName: string;
    boxGroupArea: string;
  };
}

interface SetMinRentPeriod {
  type: 'SET_MIN_RENT_PERIOD';
  payload: number;
}

interface SetMaxRentPeriod {
  type: 'SET_MAX_RENT_PERIOD';
  payload: number;
}

interface SetMaxAdvanceBookingDays {
  type: 'SET_MAX_ADVANCE_BOOKING_DAYS';
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

interface SetRentPaymentType {
  type: 'SET_RENT_PAYMENT_TYPE';
  payload: RentPaymentType;
}

interface SetRentPaymentDocumentType {
  type: 'SET_RENT_PAYMENT_DOCUMENT_TYPE';
  payload: PaymentDocument;
}

interface SetMinDaysForInstallments {
  type: 'SET_MIN_DAYS_FOR_INSTALLMENTS';
  payload: number;
}

interface SetCalculatedPrice {
  type: 'CALCULATE_RENT_PRICE_SUCCESS';
  payload: CalculatedPriceRes;
}

interface SetCalculatedAddonPrice {
  type: 'CALCULATE_VARIANT_PRICE_SUCCESS';
  payload: CalculatedAddonPriceRes;
}

interface ClearAddonPrice {
  type: 'CLEAR_ADDON_PRICE';
  payload: {
    addonId: string;
  };
}

interface LoadingPrice {
  type: 'LOADING_PRICE';
  payload: boolean;
}

interface FormStepSuccess {
  type: 'FORM_STEP_SUCCESS';
  payload: Partial<FormType>;
}

interface SetBirthDate {
  type: 'SET_BIRTHDATE';
  payload: Date;
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
  payload: {
    addonId: string;
    variantId: string | null;
    variantName: string | null;
  };
}

interface SetAddonAcceptance {
  type: 'SET_ADDON_ACCEPTANCE';
  payload: { addonId: string; acceptanceId: string; checked: boolean };
}

interface SetAddonFile {
  type: 'SET_ADDON_FILE';
  payload: { addonId: string; file: File | null };
}

interface FormReaded {
  type: 'FORM_AGREEMENT_READED_SUCCESS';
}

interface FormResignation {
  type: 'FORM_RESIGNATION_MARKED_SUCCESS';
}

interface CheckPaymentStatus {
  type: 'CHECK_PAYMENT_STATUS_SUCCESS';
  payload: boolean;
}

interface ClearPaymentMethodSuccess {
  type: 'CLEAR_PAYMENT_METHOD_SUCCESS';
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

interface FetchRentPeriodConfig {
  type: 'FETCH_RENT_PERIOD_CONFIG_SUCCESS';
  payload: {
    min: number;
    max: number;
  };
}

type Action =
  // refactored
  | SetOrderStock
  | SetOrderFullStock
  | ClearOrderStock
  | SetOrderBoxGroup
  | SetMinRentPeriod
  | SetMaxRentPeriod
  | SetMaxAdvanceBookingDays
  | SetRentStartDate
  | SetRentEndDate
  | SetCalculatedPrice
  | SetCalculatedAddonPrice
  | LoadingPrice
  | SetDiscountCode
  | LoadingAddons
  | SelectAddon
  | SetAddonAcceptance
  | SetAddonFile
  | ClearAddonPrice
  | SetBirthDate
  | SetRentPaymentType
  | SetRentPaymentDocumentType
  | SetMinDaysForInstallments
  //
  | FormStepSuccess
  | FormReaded
  | FormResignation
  | CheckPaymentStatus
  | ClearPaymentMethodSuccess
  | ClearOrder
  | FetchAddons
  | ResetDiscountCode
  | FetchRentPeriodConfig;

const initialState: OrderState = {
  // refactored
  stock: null,
  stockId: '',
  stockName: '',
  stockAddress: '',
  boxGroupId: '',
  boxGroupName: '',
  boxGroupArea: '',
  minRentPeriod: null,
  maxAdvanceBookingDays: null,
  maxRentPeriod: null,
  startDate: new Date(),
  endDate: null,
  calculatedPrice: [{ value: 0, isGross: false, netPrice: 0, grossPrice: 0, display: PriceDisplayForClients.net }],
  calculatedPriceDetails: [],
  loadingPrice: false,
  discountCode: '',
  addons: [],
  orderAddons: {},
  loadingAddons: false,
  orderAddonsId: '',
  rentPaymentType: null,
  paymentDocumentType: null,
  minRentDaysForInstallments: null,
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
    birthDate: undefined,
    street: '',
    city: '',
    postCode: '',
    phone: '',
    mailToSendInvoice: '',
  },
  paymentId: '',
  paymentSuccess: false,
  discountList: [{ text: __('application.disposableDiscount5'), value: 5 }],
  isAgreementAccepted: false,
  isResignationMarked: false,
};

export default (
  state: OrderState = initialState,
  action: Action,
): OrderState => {
  switch (action.type) {
    case 'SET_ORDER_STOCK': {
      return {
        ...state,
        stockId: action.payload.stockId,
        stockName: action.payload.stockName,
        stockAddress: action.payload.stockAddress,
      };
    }

    case 'SET_ORDER_FULL_STOCK': {
      return {
        ...state,
        stock: action.payload.stock,
      };
    }

    case 'CLEAR_ORDER_STOCK': {
      return {
        ...state,
        stockId: '',
        stockName: '',
        stockAddress: '',
      };
    }

    case 'SET_ORDER_BOX_GROUP': {
      return {
        ...state,
        boxGroupId: action.payload.boxGroupId,
        boxGroupName: action.payload.boxGroupName,
        boxGroupArea: action.payload.boxGroupArea,
      };
    }

    case 'SET_MIN_RENT_PERIOD': {
      return {
        ...state,
        minRentPeriod: action.payload,
      };
    }
    case 'SET_MIN_RENT_PERIOD': {
      return {
        ...state,
        minRentPeriod: action.payload,
      };
    }
    case 'SET_MAX_RENT_PERIOD': {
      return {
        ...state,
        maxRentPeriod: action.payload || 0,
      };
    }
    case 'SET_MAX_ADVANCE_BOOKING_DAYS': {
      return {
        ...state,
        maxAdvanceBookingDays: action.payload,
      };
    }
    case 'FETCH_RENT_PERIOD_CONFIG_SUCCESS': {
      return {
        ...state,
        minRentPeriod: action.payload.min,
        maxRentPeriod: action.payload.max || 0,
      };
    }

    case 'SET_RENT_START_DATE': {
      return {
        ...state,
        startDate: action.payload,
      };
    }

    case 'SET_RENT_END_DATE': {
      return {
        ...state,
        endDate: action.payload,
      };
    }

    case 'CALCULATE_RENT_PRICE_SUCCESS': {
      return {
        ...state,
        calculatedPrice: action.payload.price,
        calculatedPriceDetails: action.payload.details,
      };
    }

    case 'CALCULATE_VARIANT_PRICE_SUCCESS': {
      const { addonId, variantId, price } = action.payload;

      if (
        !state.orderAddons[addonId] ||
        state.orderAddons[addonId].selectedVariant !== variantId
      )
        return state;

      return {
        ...state,
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            price,
          },
        },
      };
    }

    case 'CLEAR_ADDON_PRICE': {
      const { addonId } = action.payload;

      if (!state.orderAddons[addonId]) return state;

      return {
        ...state,
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            price: null,
          },
        },
      };
    }

    case 'LOADING_PRICE': {
      return {
        ...state,
        loadingPrice: action.payload,
      };
    }

    case 'LOADING_ADDONS': {
      return {
        ...state,
        loadingAddons: action.payload,
      };
    }

    case 'SET_BIRTHDATE': {
      const newFormData: FormType = {
        ...state.formData,
        birthDate: action.payload,
      };

      return {
        ...state,
        formData: newFormData,
      };
    }

    case 'SET_RENT_PAYMENT_TYPE': {
      return {
        ...state,
        rentPaymentType: action.payload,
      };
    }

    case 'SET_RENT_PAYMENT_DOCUMENT_TYPE': {
      return {
        ...state,
        paymentDocumentType: action.payload,
      };
    }

    case 'SET_MIN_DAYS_FOR_INSTALLMENTS': {
      return {
        ...state,
        minRentDaysForInstallments: action.payload,
      };
    }

    case 'FORM_STEP_SUCCESS': {
      const newFormData: FormType = { ...state.formData, ...action.payload };

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

    case 'FETCH_ADDONS_SUCCESS': {
      const orderAddons: { [addonId: string]: OrderAddon } = {};

      action.payload.forEach((addon) => {
        const acceptanceStatuses: AcceptanceStatuses = {};

        addon.acceptances.forEach((acceptance) => {
          acceptanceStatuses[acceptance.id] = {
            accepted: false,
          };
        });

        orderAddons[addon.id] = {
          name: addon.name,
          slug: addon.slug,
          tax: addon.tax,
          required: addon.required,
          acceptances: addon.acceptances,
          acceptancesStatus: acceptanceStatuses,
          userFileAllowed: addon.userFileAllowed,
          noPricing: addon.noPricing,
          userFileRequirement: addon.userFileRequirement,
          selectedVariant: null,
          selectedVariantName: null,
          price: null,
          file: null,
        };
      });
      return {
        ...state,
        addons: action.payload.sort((a, b) =>
          a.required && !b.required ? -1 : 1,
        ),
        orderAddons,
      };
    }

    case 'SELECT_ADDON': {
      const { addonId, variantId, variantName } = action.payload;
      if (!state.orderAddons[addonId]) return state;
      return {
        ...state,
        orderAddonsId: v4(),
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            selectedVariant: variantId,
            selectedVariantName: variantName,
          },
        },
      };
    }

    case 'SET_ADDON_FILE': {
      const { addonId, file } = action.payload;
      if (!state.orderAddons[addonId]) return state;
      return {
        ...state,
        orderAddonsId: v4(),
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            file: file,
          },
        },
      };
    }

    case 'SET_ADDON_ACCEPTANCE': {
      const { addonId, acceptanceId, checked } = action.payload;
      if (!state.orderAddons[addonId]) return state;
      return {
        ...state,
        orderAddonsId: v4(),
        orderAddons: {
          ...state.orderAddons,
          [addonId]: {
            ...state.orderAddons[addonId],
            acceptancesStatus: {
              ...state.orderAddons[addonId].acceptancesStatus,
              [acceptanceId]: {
                accepted: checked,
              },
            },
          },
        },
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

    case 'CLEAR_PAYMENT_METHOD_SUCCESS':
      return {
        ...state,
        isResignationMarked: false,
      };

    case 'CLEAR_ORDER': {
      return initialState;
    }

    default:
      return state;
  }
};
