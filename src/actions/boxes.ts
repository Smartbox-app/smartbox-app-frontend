import ApiService from '../services/api-service';

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

export const boxDataCleanUp = () => ({ type: 'CLEAN_SINGLE_BOX_DETAILS_SUCCESS' });
