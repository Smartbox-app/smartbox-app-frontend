import ApiService from '../services/api-service';

export const fetchMyRentHistory = () => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_MY_RENT_HISTORY_SUCCESS',
    'FETCH_MY_RENT_HISTORY_FAILED',
    null,
    null,
    'rent/story',
    'LOADING_RENT_HISTORY',
  );
};

export const getMinRentPeriodExtendingForRent = (rentId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_RENT_MIN_PERIOD_SUCCESS',
    'FETCH_RENT_MIN_PERIOD_FAILED',
    null,
    null,
    `rent/min-period/${rentId}`,
    'LOADING_RENT_PERIOD',
  );
};

export const getSingleRent = (rentId: string) => ({ type: 'GET_SINGLE_RENT', payload: rentId });

export const toggleShowUserStockMap = () => ({ type: 'TOGGLE_SHOW_USER_STOCK_MAP' });

export const endMyRent = (rentId: string) => async (dispatch: any) => {
  await ApiService.patch(dispatch, 'END_MY_RENT_SUCCESS', 'END_MY_RENT_FAILED', null, null, `rent/finish/${rentId}`);
};

export const getMyRentList = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'GET_MY_RENT_LIST_SUCCESS', 'GET_MY_RENT_LIST_FAILED', null, null, 'rent/me-list');
};
