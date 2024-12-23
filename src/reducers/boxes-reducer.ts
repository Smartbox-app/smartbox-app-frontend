import { BoxListItem, RentDetailsRes, RentStatus } from 'smartbox-types';

export type Boxes = {
  singleBoxDetail: RentDetailsRes;
};

const initialState: Boxes = {
  singleBoxDetail: {
    number: '',
    startAt: new Date(),
    finishAt: new Date(),
    status: RentStatus.free,
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

export default (state: Boxes = initialState, action: Action): any => {
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
        singleBoxDetail: {
          number: '',
          startAt: new Date(),
          finishAt: new Date(),
          status: RentStatus.free,
          owner: {
            email: '',
            firstName: '',
            lastName: '',
            rentCount: 0,
            phone: '',
          },
        },
      };
    }

    default:
      return state;
  }
};
