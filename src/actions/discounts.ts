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
