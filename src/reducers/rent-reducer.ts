import { MyRentList, RentStatus } from 'smartbox-types';

export type RentsStatus = {
  singleRent: MyRentList;
  rentsList: MyRentList[];
  rentsHistoryList: MyRentList[];
  stockId: string;
  showUserStockMap: boolean;
  loading: boolean;
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

interface FetchMyRentHistory {
  type: 'FETCH_MY_RENT_HISTORY_SUCCESS';
  payload: MyRentList[];
}

interface ShowMapToggle {
  type: 'TOGGLE_SHOW_USER_STOCK_MAP';
}

interface LoadingRentHistory {
  type: 'LOADING_RENT_HISTORY';
  payload: boolean;
}

type Action = BoxGroup | GetSingleRent | GetMySingleRent | FetchMyRentHistory | ShowMapToggle | LoadingRentHistory;

const initialState: RentsStatus = {
  singleRent: {
    id: '',
    boxId: '',
    boxAdditionalInfo: '',
    boxNumber: '',
    createdAt: new Date(),
    startAt: new Date(),
    finishAt: new Date(),
    status: RentStatus.free,
    size: 0,
    stockName: '',
    stockId: '',
    number: '',
    getProps: () => [],
  },
  rentsList: [],
  rentsHistoryList: [],
  stockId: '',
  showUserStockMap: false,
  loading: false,
};

export default (state: RentsStatus = initialState, action: Action): any => {
  switch (action.type) {
    case 'FETCH_MY_RENT_HISTORY_SUCCESS': {
      const active: MyRentList[] = [];
      const other: MyRentList[] = [];

      action.payload.forEach((d: MyRentList) => {
        if (d.status === RentStatus.rented) {
          active.push(d);
        } else {
          other.push(d);
        }
      });

      return {
        ...state,
        rentsHistoryList: [...active, ...other],
      };
    }
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
    case 'TOGGLE_SHOW_USER_STOCK_MAP': {
      return {
        ...state,
        showUserStockMap: !state.showUserStockMap,
      };
    }
    case 'LOADING_RENT_HISTORY': {
      return {
        ...state,
        loading: action.payload,
      };
    }
    default:
      return state;
  }
};
