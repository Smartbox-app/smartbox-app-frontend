import ApiService from "../services/api-service";

export const getStockGroupsList = () => async (dispatch: any) => {
    await ApiService.get(dispatch, 'GET_STOCK_GROUP_LIST_SUCCESS', 'GET_STOCK_GROUP_LIST_FAILED', null, null, 'stock-group/list');
  };