import { StockGroupData, StockGroupWithStocks } from 'smartbox-types';

export interface StockGroupStatus {
    list: StockGroupWithStocks[];
}

const initialState: StockGroupStatus = {
    list: [],
};

interface FetchStockGroupsList {
    type: 'GET_STOCK_GROUP_LIST_SUCCESS';
    payload: StockGroupData[];
}

type Action = FetchStockGroupsList;

export default (state: StockGroupStatus = initialState, action: Action) => {
    switch (action.type) {
        case 'GET_STOCK_GROUP_LIST_SUCCESS':
            return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
