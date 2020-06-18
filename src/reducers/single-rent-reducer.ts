export type SingleRentStatus = {
  singleRent: any;
};

interface BoxGroup {
  type: 'FETCH_MY_RENT_STORY_SUCCESS';
  payload: any;
}

type Action = BoxGroup;

const initialState: SingleRentStatus = {
  singleRent: {},
};

export default (state: SingleRentStatus = initialState, action: Action): any => {
  switch (action.type) {
    case 'FETCH_MY_RENT_STORY_SUCCESS': {
      return {
        ...state,
        singleRent: action.payload,
      };
    }

    default:
      return state;
  }
};
