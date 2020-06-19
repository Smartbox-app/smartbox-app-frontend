import { MyRentList, RentStatus } from 'smartbox-types';

export type SingleRentStatus = {
  singleRent: MyRentList;
  rentsList: MyRentList[];
};

interface BoxGroup {
  type: 'FETCH_MY_RENT_STORY_SUCCESS';
  payload: RentStatus;
}

type Action = BoxGroup;

const initialState: SingleRentStatus = {
  singleRent: {
    id: '',
    startAt: new Date(),
    finishAt: new Date(),
    status: RentStatus.free,
    size: 0,
    stockName: '',
    number: '',
    getProps: () => [],
  },
  rentsList: [],
};

export default (state: SingleRentStatus = initialState, action: Action): any => {
  switch (action.type) {
    case 'FETCH_MY_RENT_STORY_SUCCESS': {
      return {
        ...state,
        rentsList: action.payload,
      };
    }

    default:
      return state;
  }
};
