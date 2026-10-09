import type { AppDispatch } from 'src/types/app-dispatch';
import ApiService from '../services/api-service';
import { refreshApiTableData } from './api-table';

export const deleteStockDiscount = (discountId: string) => async (dispatch: AppDispatch) => {
  await ApiService.delete(
    dispatch,
    'DELETE_DISCOUNT_SUCCESS',
    'DELETE_DISCOUNT_FAILED',
    () => {
      dispatch(refreshApiTableData());
    },
    null,
    `stock/discount/${discountId}`,
  );
};

export const getStockList = () => async (dispatch: AppDispatch) => {
  await ApiService.get(dispatch, 'GET_STOCK_LIST_SUCCESS', 'GET_STOCK_LIST_FAILED', null, null, 'stock/list');
};

export const getStockDiscountsList = () => async (dispatch: AppDispatch) => {
  await ApiService.get(
    dispatch,
    'FETCH_STOCK_DISCOUNTS_LIST_SUCCESS',
    'FETCH_STOCK_DISCOUNTS_LIST_FAILED',
    null,
    null,
    'stock/discounts',
  );
};
