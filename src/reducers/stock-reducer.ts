import { StockList } from 'smartbox-types';

export interface StockStatus {
  list: StockList[];
};

const initialState: StockStatus = {
  list: [],
};

interface FetchWorkersList {
  type: 'GET_STOCK_LIST_SUCCESS';
  payload: StockList[];
}

type Action = FetchWorkersList;

export default (state: StockStatus = initialState, action: Action) => {
  switch (action.type) {
    case 'GET_STOCK_LIST_SUCCESS':
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};
