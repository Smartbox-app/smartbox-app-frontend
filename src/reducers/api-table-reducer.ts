import { TableResponse } from 'smartbox-tables';
import { v4 } from 'uuid';
import { DEFAULT_API_TABLE_INSTANCE_ID } from '../constants/api-table-instances';

interface ApiTable {
  uuid: string;
}

export type ApiTableState = TableResponse<any> & ApiTable;

export type ApiTableRootState = {
  instances: Record<string, ApiTableState>;
};

const createEmptyTableState = (): ApiTableState => ({
  countTotal: 0,
  items: [],
  uuid: v4(),
});

const initialState: ApiTableRootState = {
  instances: {
    [DEFAULT_API_TABLE_INSTANCE_ID]: createEmptyTableState(),
  },
};

export type FetchApiTableSuccessPayload = TableResponse<any> & {
  instanceId?: string;
};

interface FetchApiTableDataSuccess {
  type: 'FETCH_API_TABLE_DATA_SUCCESS';
  payload: FetchApiTableSuccessPayload;
}

interface RefreshApiTable {
  type: 'REFRESH_API_TABLE';
  payload?: { instanceId?: string };
}

interface ClearApiTable {
  type: 'CLEAR_API_TABLE';
  payload?: { instanceId?: string };
}

type Action = FetchApiTableDataSuccess | RefreshApiTable | ClearApiTable;

export default (state: ApiTableRootState = initialState, action: Action) => {
  switch (action.type) {
    case 'FETCH_API_TABLE_DATA_SUCCESS': {
      const { instanceId, ...data } = action.payload;
      const normalizedInstance =
      instanceId ?? DEFAULT_API_TABLE_INSTANCE_ID;

      const prev =
        state.instances[normalizedInstance] ?? createEmptyTableState();

      return {
        ...state,
        instances: {
          ...state.instances,
          [normalizedInstance]: {
            ...prev,
            ...data,
          },
        },
      };
    }
    case 'REFRESH_API_TABLE': {
      if (action.payload == null) {
        const nextInstances: Record<string, ApiTableState> = {};
        for (const key of Object.keys(state.instances)) {
          const current = state.instances[key] ?? createEmptyTableState();
          nextInstances[key] = { ...current, uuid: v4() };
        }
        return { ...state, instances: nextInstances };
      }

      const instanceId =
        action.payload.instanceId ?? DEFAULT_API_TABLE_INSTANCE_ID;

      const current = state.instances[instanceId] ?? createEmptyTableState();
      return {
        ...state,
        instances: {
          ...state.instances,
          [instanceId]: {
            ...current,
            uuid: v4(),
          },
        },
      };
    }
    case 'CLEAR_API_TABLE': {
      const instanceId =
        action.payload?.instanceId ?? DEFAULT_API_TABLE_INSTANCE_ID;
      return {
        ...state,
        instances: {
          ...state.instances,
          [instanceId]: createEmptyTableState(),
        },
      };
    }
    default:
      return state;
  }
};
