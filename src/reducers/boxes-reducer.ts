import { BoxListItem, RentDetailsRes, RentStatus, BoxGroupAvailability } from 'smartbox-types';

export type Boxes = {
  boxesGroup: BoxListItem[] | null;
  singleBoxDetail: RentDetailsRes;
};

const initialState: Boxes = {
  boxesGroup: null,
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

interface FetchBoxStatuses {
  type: 'FETCH_BOX_STATUSES_SUCCESS';
  payload: BoxListItem[];
}

interface FetchSingleBoxDetails {
  type: 'FETCH_SINGLE_BOX_DETAILS_SUCCESS';
  payload: RentDetailsRes;
}

interface BoxGroup {
  type: 'FETCH_BOX_AVAILABILITY_SUCCESS';
  payload: BoxGroupAvailability[];
}

type Action = FetchBoxStatuses | FetchSingleBoxDetails | BoxGroup;

export default (state: Boxes = initialState, action: Action): any => {
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
