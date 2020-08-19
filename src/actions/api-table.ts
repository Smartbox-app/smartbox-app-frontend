import ApiService from '../services/api-service';

export const fetchApiTableData = (url: string) => async (dispatch: any) => {
  await ApiService.get(dispatch, 'FETCH_API_TABLE_DATA_SUCCESS', 'FETCH_API_TABLE_DATA_FAILED', null, null, url);
};

export const refreshApiTableData = () => ({ type: 'REFRESH_API_TABLE' });
