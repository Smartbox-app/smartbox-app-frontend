export type SingleRentStatus = {};

interface BoxGroup {
  type: 'FETCH_MY_RENT_STORY_SUCCESS';
  payload: any;
}

type Action = BoxGroup;

const initialState = {};

export default (state: SingleRentStatus = initialState, action: Action): any => {
  switch (action.type) {
    case 'FETCH_MY_RENT_STORY_SUCCESS': {
      return {
        ...state,
        boxesGroup: action.payload,
      };
    }

    default:
      return state;
  }
};
