import type { AppDispatch } from 'src/types/app-dispatch';
import ApiService from '../services/api-service';

export const getPeriodConfigForExtendingRent = (rentId: string) => async (dispatch: AppDispatch) => {
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
