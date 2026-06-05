import ApiService from '../services/api-service';
import { DEFAULT_API_TABLE_INSTANCE_ID } from '../constants/api-table-instances';

export const fetchApiTableData =
  (url: string, method = 'GET', instanceId = DEFAULT_API_TABLE_INSTANCE_ID) =>
  async (dispatch: any) => {
    dispatch({ type: 'LOADING', payload: true });
    try {
      const payload = await ApiService.callFetch(
        method,
        url,
        undefined,
        undefined,
        undefined,
        true,
      );
      if (payload && typeof payload === 'object') {
        dispatch({
          type: 'FETCH_API_TABLE_DATA_SUCCESS',
          payload: { instanceId, ...payload },
        });
      }
    } finally {
      dispatch({
        type: 'LOADING_API_TABLE',
        payload: { isLoading: false, instanceId },
      });
    }
  };

export const clearApiTableData = (
  instanceId = DEFAULT_API_TABLE_INSTANCE_ID,
) => ({
  type: 'CLEAR_API_TABLE',
  payload: { instanceId },
});

export const loadingApiTableData = (
  instanceId = DEFAULT_API_TABLE_INSTANCE_ID,
) => ({
  type: 'LOADING_API_TABLE',
  payload: { instanceId },
});

export const refreshApiTableData = (
  instanceId = DEFAULT_API_TABLE_INSTANCE_ID,
) => ({
  type: 'REFRESH_API_TABLE',
  payload: { instanceId },
});
