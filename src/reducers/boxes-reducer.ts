import { BoxListItem, RentDetailsRes, RentStatus } from 'smartbox-types';

interface State {
  boxesGroup: BoxListItem[];
  singleBoxDetail: RentDetailsRes;
}

const initialState = {
  boxesGroup: [],
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
    },
  },
};

interface FetchBoxStatuses {
  type: 'FETCH_BOX_STATUSES_SUCCESS';
  payload: BoxListItem[];
}

interface FetchSingleBoxDetails {
  type: 'FETCH_SINGLE_BOX_DETAILS_SUCCESS';
  payload: RentDetailsRes;
}

type Action = FetchBoxStatuses | FetchSingleBoxDetails;

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'FETCH_BOX_STATUSES_SUCCESS': {
      return {
        ...state,
        boxesGroup: action.payload,
      };
    }

    case 'FETCH_SINGLE_BOX_DETAILS_SUCCESS': {
      return {
        ...state,
        singleBoxDetail: action.payload,
      };
    }

    default:
      return state;
  }
};
