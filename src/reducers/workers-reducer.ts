import { TableResponse } from 'smartbox-tables';
import { UserListRes } from 'smartbox-types';

interface State {
  list: TableResponse<UserListRes>;
}

const initialState: State = {
  list: {
    countTotal: 0,
    items: [],
  },
};

interface FetchWorkersList {
  type: 'FETCH_WORKERS_LIST_SUCCESS';
  payload: TableResponse<UserListRes>;
}

type Action = FetchWorkersList;

export default (state: State = initialState, action: Action) => {
  switch (action.type) {
    case 'FETCH_WORKERS_LIST_SUCCESS':
      return {
        ...state,
        list: action.payload,
      };
    default:
      return state;
  }
};
