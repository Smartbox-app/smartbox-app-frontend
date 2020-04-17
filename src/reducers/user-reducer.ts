import { UserEntity, UserRole, AuthLoginResult } from 'smartbox-types';
import { TableResponse } from 'smartbox-tables';
import SessionService from '../services/session-service';

interface State {
  details: UserEntity;
  list: TableResponse<any>;
  singleUser: any;
}

interface Login {
  type: 'LOGIN_SUCCESS';
  payload: any;
}

interface Logout {
  type: 'LOGOUT';
  payload: any;
}

interface GetSingleTypeUsers {
  type: 'GET_SINGEL_TYPE_USERS_SUCCESS';
  payload: TableResponse<any>;
}

interface FetchSingleUser {
  type: 'FETCH_SINGLE_USER_SUCCESS';
  payload: any;
}

interface ClearUserSession {
  type: 'CLEAR_USER_SESSION';
}

interface GeetMyDetails {
  type: 'GET_MY_DETAILS_SUCCESS';
  payload: AuthLoginResult;
}

type Action = Login | Logout | GetSingleTypeUsers | FetchSingleUser | ClearUserSession | GeetMyDetails;

const initialState = {
  details: SessionService.getUser(),
  list: {
    countTotal: 0,
    items: [],
  },
  singleUser: {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    role: UserRole.admin,
    blocked: true,
  },
};

export default (state: State = initialState, action: Action): any => {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      const { user } = action.payload;
      SessionService.setUser(user);
      return {
        ...state,
        details: user,
      };
    }
    case 'GET_MY_DETAILS_SUCCESS': {
      const user = {
        ...state.details,
        ...action.payload,
      };
      SessionService.setUser(user);
      return {
        ...state,
        details: user,
      };
    }
    case 'LOGOUT':
      SessionService.clearUserSession();
      return { ...state, details: null };
    case 'CLEAR_USER_SESSION':
      SessionService.clearSessionStorage();
      SessionService.clearUserSession();
      return { ...state, details: null };
    case 'GET_SINGEL_TYPE_USERS_SUCCESS':
      return {
        ...state,
        list: action.payload,
      };
    case 'FETCH_SINGLE_USER_SUCCESS':
      return {
        ...state,
        singleUser: action.payload,
      };
    default:
      return state;
  }
};
