import ApiService from '../services/api-service';

export const getPeriodConfigForExtendingRent = (rentId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_RENT_PERIOD_CONFIG_SUCCESS',
    'FETCH_RENT_PERIOD_CONFIG_FAILED',
    null,
    null,
    `rent/period-config/${rentId}`,
    'LOADING_PERIOD_CONFIG',
  );
};

export const toggleShowUserStockMap = () => ({ type: 'TOGGLE_SHOW_USER_STOCK_MAP' });

export const getMyRentList = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'GET_MY_RENT_LIST_SUCCESS', 'GET_MY_RENT_LIST_FAILED', null, null, 'rent/me-list');
};
