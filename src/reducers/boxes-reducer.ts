import { BoxListItem } from 'smartbox-types';

interface State {
  boxesGroup: BoxListItem[];
}

const initialState = {
  boxesGroup: [],
};

interface FetchBoxStatuses {
  type: 'FETCH_BOX_STATUSES_SUCCESS';
  payload: BoxListItem[];
}

type Action = FetchBoxStatuses;

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'FETCH_BOX_STATUSES_SUCCESS': {
      return {
        ...state,
        boxesGroup: action.payload,
      };
    }

    default:
      return state;
  }
};
