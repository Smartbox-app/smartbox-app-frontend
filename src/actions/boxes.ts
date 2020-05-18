import ApiService from '../services/api-service';

export const fetchBoxStatuses = () => async (dispatch: any) => {
  await ApiService.get(
    dispatch,
    'FETCH_BOX_STATUSES_SUCCESS',
    'FETCH_BOX_STATUSES_FAILED',
    null,
    null,
    'rent/box-list',
  );
};
