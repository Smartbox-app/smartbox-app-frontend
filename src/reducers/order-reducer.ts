import { addDays } from 'date-fns';
import { BoxGroupAvailability, usePricing, ICalculateProps, IPricingResult } from 'smartbox-types';
import { FormType } from '../types/order-form';

export type OrderState = {
  formData: FormType;
  paymentId: string;
  countedPrice: IPricingResult;
  boxAvailability: BoxGroupAvailability[];
  discountList: any[];
  isAgreementAccepted: boolean;
  isResignationMarked: boolean;
  bankList: any;
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
  type: 'SAVE_BANKS_LIST';
  payload: any;
}

type Action =
  | FormStepSuccess
  | FetchBoxAvailability
  | SentRentBoxRequestSuccess
  | FormReaded
  | FormResignation
  | SaveBankList;

const bankListDummy = {
  '103': {
    id: '103',
    name: 'Karta płatnicza',
    banks: '53',
    img: 'https://secure.tpay.com/_/g/103.png?4',
    main_bank_id: '53',
  },
  '113': {
    id: '113',
    name: 'Alior Bank SA',
    banks: '9,64,29',
    img: 'https://secure.tpay.com/_/g/113.png?4',
    main_bank_id: '9',
  },
  '102': {
    id: '102',
    name: 'Bank Pekao SA',
    banks: '47,55,4,64,60,29',
    img: 'https://secure.tpay.com/_/g/102.png?4',
    main_bank_id: '4',
  },
  '108': {
    id: '108',
    name: 'PKO Bank Polski',
    banks: '21,64,29',
    img: 'https://secure.tpay.com/_/g/108.png?4',
    main_bank_id: '21',
  },
  '110': {
    id: '110',
    name: 'Inteligo',
    banks: '14,64,29',
    img: 'https://secure.tpay.com/_/g/110.png?4',
    main_bank_id: '14',
  },
  '150': {
    id: '150',
    name: 'BLIK',
    banks: '64,29',
    img: 'https://secure.tpay.com/_/g/150.png?4',
    main_bank_id: '64',
  },
  '160': {
    id: '160',
    name: 'mBank',
    banks: '18,64,60,29',
    img: 'https://secure.tpay.com/_/g/160.png?4',
    main_bank_id: '18',
  },
  '111': {
    id: '111',
    name: 'ING Bank Śląski SA',
    banks: '13,64,29',
    img: 'https://secure.tpay.com/_/g/111.png?4',
    main_bank_id: '13',
  },
  '114': {
    id: '114',
    name: 'Bank Millennium SA',
    banks: '48,2,64,60,29',
    img: 'https://secure.tpay.com/_/g/114.png?4',
    main_bank_id: '2',
  },
  '115': {
    id: '115',
    name: 'Santander Bank Polska SA',
    banks: '6,64,60,29',
    img: 'https://secure.tpay.com/_/g/115.png?4',
    main_bank_id: '6',
  },
  '132': {
    id: '132',
    name: 'Citibank Handlowy SA',
    banks: '7,29',
    img: 'https://secure.tpay.com/_/g/132.png?4',
    main_bank_id: '7',
  },
  '116': {
    id: '116',
    name: 'Credit Agricole Polska SA',
    banks: '17,64,29',
    img: 'https://secure.tpay.com/_/g/116.png?4',
    main_bank_id: '17',
  },
  '119': {
    id: '119',
    name: 'Getin Bank SA',
    banks: '12,64,60,29',
    img: 'https://secure.tpay.com/_/g/119.png?4',
    main_bank_id: '12',
  },
  '112': {
    id: '112',
    name: 'T-Mobile Usługi Bankowe',
    banks: '52,64,29',
    img: 'https://secure.tpay.com/_/g/112.png?4',
    main_bank_id: '52',
  },
  '124': {
    id: '124',
    name: 'Bank Pocztowy SA',
    banks: '5,29',
    img: 'https://secure.tpay.com/_/g/124.png?4',
    main_bank_id: '5',
  },
  '128': {
    id: '128',
    name: 'Idea Bank',
    banks: '62,29',
    img: 'https://secure.tpay.com/_/g/128.png?4',
    main_bank_id: '62',
  },
  '135': {
    id: '135',
    name: 'Banki Spółdzielcze',
    banks: '42,63,28,29',
    img: 'https://secure.tpay.com/_/g/135.png?4',
    main_bank_id: '63',
  },
  '133': {
    id: '133',
    name: 'Bank Gospodarki Żywnościowej SA',
    banks: '1,64,29',
    img: 'https://secure.tpay.com/_/g/133.png?4',
    main_bank_id: '1',
  },
  '159': {
    id: '159',
    name: 'Neo Bank',
    banks: '24,29',
    img: 'https://secure.tpay.com/_/g/159.png?4',
    main_bank_id: '24',
  },
  '130': {
    id: '130',
    name: 'Nest Bank',
    banks: '26,29',
    img: 'https://secure.tpay.com/_/g/130.png?4',
    main_bank_id: '26',
  },
  '145': {
    id: '145',
    name: 'Plus Bank SA',
    banks: '15,60,29',
    img: 'https://secure.tpay.com/_/g/145.png?4',
    main_bank_id: '15',
  },
  '166': {
    id: '166',
    name: 'Google Pay',
    banks: '68',
    img: 'https://secure.tpay.com/_/g/166.png?4',
    main_bank_id: '68',
  },
  '104': {
    id: '104',
    name: 'MasterPass',
    banks: '57',
    img: 'https://secure.tpay.com/_/g/104.png?4',
    main_bank_id: '57',
  },
  '106': {
    id: '106',
    name: 'PayPal',
    banks: '31',
    img: 'https://secure.tpay.com/_/g/106.png?4',
    main_bank_id: '31',
  },
  '109': {
    id: '109',
    name: 'Alior Raty',
    banks: '49',
    img: 'https://secure.tpay.com/_/g/109.png?4',
    main_bank_id: '49',
  },
  '148': {
    id: '148',
    name: 'Euro Payment',
    banks: '50',
    img: 'https://secure.tpay.com/_/g/148.png?4',
    main_bank_id: '50',
  },
  '157': {
    id: '157',
    name: 'Druczek płatności / Przelew z innego banku',
    banks: '29',
    img: 'https://secure.tpay.com/_/g/157.png?4',
    main_bank_id: '29',
  },
  '163': {
    id: '163',
    name: 'Visa Checkout',
    banks: '65',
    img: 'https://secure.tpay.com/_/g/163.png?4',
    main_bank_id: '65',
  },
};

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
  bankList: bankListDummy,
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
    case 'SAVE_BANKS_LIST':
      return {
        ...state,
        // bankList: action.payload,
      };
    default:
      return state;
  }
};


