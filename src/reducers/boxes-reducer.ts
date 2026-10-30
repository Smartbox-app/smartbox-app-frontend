import { RentDetailsRes, RentPaymentType, RentStatus } from 'smartbox-types';

export type Boxes = {
  singleBoxDetail: RentDetailsRes;
};

const initialState: Boxes = {
  singleBoxDetail: {
    id: '',
    number: '',
    createdAt: new Date(),
    decisionFinishAt: new Date(),
    isAuthorized: false,
    startAt: new Date(),
    finishAt: new Date(),
    status: RentStatus.reserved,
    paymentType: RentPaymentType.InAdvance,
    description: [],
    periods: [],
    owner: {
      email: '',
      firstName: '',
      lastName: '',
      rentCount: 0,
      phone: '',
    },
  },
};

interface FetchSingleBoxDetails {
  type: 'FETCH_SINGLE_BOX_DETAILS_SUCCESS';
  payload: RentDetailsRes;
}

interface CleanUp {
  type: 'CLEAN_SINGLE_BOX_DETAILS_SUCCESS';
}

type Action =  FetchSingleBoxDetails | CleanUp;

export default (state: Boxes = initialState, action: Action): Boxes => {
  switch (action.type) {

    case 'FETCH_SINGLE_BOX_DETAILS_SUCCESS': {
      return {
        ...state,
        singleBoxDetail: action.payload,
      };
    }

    case 'CLEAN_SINGLE_BOX_DETAILS_SUCCESS': {
      return {
        ...state,
        singleBoxDetail: initialState.singleBoxDetail,
      };
    }

    default:
      return state;
  }
};
