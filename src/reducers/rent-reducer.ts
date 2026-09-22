import { MyRentList, RentStatus } from 'smartbox-types';

export type RentsStatus = {
  singleRent: MyRentList;
  stockId: string;
  showUserStockMap: boolean;
  loading: boolean;
};

interface ClearOrder {
  type: 'CLEAR_ORDER';
}

interface ShowMapToggle {
  type: 'TOGGLE_SHOW_USER_STOCK_MAP';
}

type Action = ShowMapToggle | ClearOrder;

const initialState: RentsStatus = {
  singleRent: {
    id: '',
    boxId: '',
    boxAdditionalInfo: '',
    boxNumber: '',
    createdAt: new Date(),
    startAt: new Date(),
    finishAt: new Date(),
    status: RentStatus.reserved,
    size: 0,
    stockName: '',
    stockId: '',
    number: '',
    getProps: () => [],
  },
  stockId: '',
  showUserStockMap: false,
  loading: false,
};

export default (state: RentsStatus = initialState, action: Action): any => {
  switch (action.type) {
    case 'CLEAR_ORDER': {
      return {
        ...state,
        singleRent: null,
      };
    }
    case 'TOGGLE_SHOW_USER_STOCK_MAP': {
      return {
        ...state,
        showUserStockMap: !state.showUserStockMap,
      };
    }

    default:
      return state;
  }
};
