import ApiService from '../services/api-service';

export const deleteStockDiscount = (discountId: string) => async (dispatch: any) => {
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
  await ApiService.get(dispatch, 'GET_STOCK_LIST_SUCCESS', 'GET_STOCK_LIST_FAILED', null, null, 'stock/list');
};

export const getStockDiscountsList = () => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_STOCK_DISCOUNTS_LIST_SUCCESS',
    'FETCH_STOCK_DISCOUNTS_LIST_FAILED',
    null,
    null,
    'stock/list',
  );
};
