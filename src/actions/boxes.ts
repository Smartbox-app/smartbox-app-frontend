import ApiService from '../services/api-service';

export const fetchBoxStatuses = (stockId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_BOX_STATUSES_SUCCESS',
    'FETCH_BOX_STATUSES_FAILED',
    null,
    null,
    `rent/box-list/${stockId}`,
  );
};

export const fetchSingleBoxDetails = (rentId: string) => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_SINGLE_BOX_DETAILS_SUCCESS',
    'FETCH_SINGLE_BOX_DETAILS_FAILED',
    null,
    null,
    `rent/details/${rentId}`,
  );
};
