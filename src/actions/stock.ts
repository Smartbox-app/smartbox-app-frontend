import ApiService from '../services/api-service';
import { Coordinate } from 'smartbox-types';

export const deleteDiscount = (discountId: string) => async (dispatch: any) => {
  await ApiService.delete(
    dispatch,
    'DELETE_DISCOUNT_SUCCESS',
    'DELETE_DISCOUNT_FAILED',
    null,
    null,
    `stock/discount/${discountId}`,
  );
};

export const getStockList = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'GET_STOCK_LIST_SUCCESS', 'GET_STOCK_LIST_FAILED', null, null, `stock/list`);
};

export const askGateToOpen = (geo: Coordinate) => async (disaptch: any) => {
  await ApiService.patch(
    disaptch,
    'ASK_GATE_TO_OPEN_SUCCESS',
    'ASK_GATE_TO_OPEN_FAILED',
    null,
    null,
    `stock/open-gate/${geo.lat}/${geo.lon}`,
    'LOADING',
    geo,
  );
};
