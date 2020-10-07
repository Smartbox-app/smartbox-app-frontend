import { DiscountList, StockList } from 'smartbox-types';

export interface StockStatus {
  list: StockList[];
  discountsList: DiscountList[];
}

const initialState: StockStatus = {
  list: [],
  discountsList: [],
};

interface FetchWorkersList {
  type: 'GET_STOCK_LIST_SUCCESS';
  payload: StockList[];
}

interface FetchDiscountsList {
  type: 'FETCH_STOCK_DISCOUNTS_LIST_SUCCESS';
  payload: DiscountList[];
}

type Action = FetchWorkersList | FetchDiscountsList;

export default (state: StockStatus = initialState, action: Action) => {
  switch (action.type) {
    case 'GET_STOCK_LIST_SUCCESS':
      return {
        ...state,
        list: action.payload,
      };
    case 'FETCH_STOCK_DISCOUNTS_LIST_SUCCESS':
      return {
        ...state,
        discountsList: action.payload,
      };
    default:
      return state;
  }
};
