import { StockList } from 'smartbox-types';

export interface StockStatus {
  list: StockList[];
}

const initialState: StockStatus = {
  list: [],
};

export default (state: StockStatus = initialState) => state;
