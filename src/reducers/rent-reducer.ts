import { MyRentList, RentStatus } from 'smartbox-types';

export type RentsStatus = {
  singleRent: MyRentList;
  rentsList: MyRentList[];
  stockId: string;
};

interface BoxGroup {
  type: 'FETCH_MY_RENT_STORY_SUCCESS';
  payload: MyRentList[];
}

interface GetSingleRent {
  type: 'GET_SINGLE_RENT';
  payload: string;
}

interface GetMySingleRent {
  type: 'GET_MY_RENT_LIST_SUCCESS';
  payload: MyRentList[];
}


type Action = BoxGroup | GetSingleRent | GetMySingleRent;

const initialState: RentsStatus = {
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
  stockId: '',
};

export default (state: RentsStatus = initialState, action: Action): any => {
  switch (action.type) {
    case 'FETCH_MY_RENT_STORY_SUCCESS': {
      return {
        ...state,
        rentsList: action.payload.filter((rent: MyRentList) => rent.status !== RentStatus.failure),
      };
    }
    case 'GET_MY_RENT_LIST_SUCCESS': {
      return {
        ...state,
        rentsList: action.payload,
      };
    }

    case 'GET_SINGLE_RENT': {
      const foundRent = state.rentsList.find((rent: MyRentList) => rent.id === action.payload);
      if (foundRent) {
        return {
          ...state,
          singleRent: foundRent,
        };
      } else {
        return {
          ...state,
        };
      }
    }

    default:
      return state;
  }
};
