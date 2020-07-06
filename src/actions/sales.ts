import ApiService from '../services/api-service';

export const fetchSingleBoxDetails = (discoutnId: string) => async (dispatch: any) => {
  await ApiService.delete(
    dispatch,
    'DELETE_SINGLE_SALES_SUCCESS',
    'DELETE_SINGLE_SALES_FAILED',
    null,
    null,
    `stock/discount/${discoutnId}`,
  );
};
