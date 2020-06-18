import ApiService from '../services/api-service';

export const fetchMyRentStory = () => async (dispatch: any) => {
  await ApiService.get(dispatch, 'FETCH_MY_RENT_STORY_SUCCESS', 'FETCH_MY_RENT_STORY_FAILED', null, null, 'rent/story');
};
