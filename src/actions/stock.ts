import type { AppDispatch } from 'src/types/app-dispatch';
import ApiService from '../services/api-service';

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
