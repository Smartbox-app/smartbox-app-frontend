import { TableResponse } from 'smartbox-tables';
import { v4 } from 'uuid';

interface ApiTable {
  uuid: string;
}
export type ApiTableState = TableResponse<any> | ApiTable;

const initialState: ApiTableState = {
  countTotal: 0,
  items: [],
  uuid: v4(),
};

interface FetchApiTableDataSuccess {
  type: 'FETCH_API_TABLE_DATA_SUCCESS';
  payload: TableResponse<any>;
}

interface RefreshApiTable {
  type: 'REFRESH_API_TABLE';
}

type Action = FetchApiTableDataSuccess | RefreshApiTable;

export default (state: ApiTableState = initialState, action: Action) => {
  switch (action.type) {
    case 'FETCH_API_TABLE_DATA_SUCCESS':
      return action.payload;
    case 'REFRESH_API_TABLE':
      return {
        ...state,
        uuid: v4(),
      };
    default:
      return state;
  }
};
