import ApiService from '../services/api-service';

export const fetchMyRentStory = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'FETCH_MY_RENT_STORY_SUCCESS', 'FETCH_MY_RENT_STORY_FAILED', null, null, 'rent/story');
};

export const getSingleRent = (rentId: string) => ({ type: 'GET_SINGLE_RENT', payload: rentId });

export const endMyRent = (rentId: string) => async (dispatch: any) => {
  await ApiService.patch(dispatch, 'END_MY_RENT_SUCCESS', 'END_MY_RENT_FAILED', null, null, `rent/finish/${rentId}`);
};

export const getMyRentList = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'GET_MY_RENT_LIST_SUCCESS', 'GET_MY_RENT_LIST_FAILED', null, null, 'rent/me-list');
};
