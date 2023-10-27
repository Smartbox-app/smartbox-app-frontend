import { UserRole, UserRes } from 'smartbox-types';
import SessionService from '../services/session-service';

export type UserState = {
  details: UserRes | null;
  singleUser: UserRes | any;
};

interface Login {
  type: 'LOGIN_SUCCESS';
  payload: { user: UserRes };
}

interface Logout {
  type: 'LOGOUT';
}

interface FetchSingleUser {
  type: 'FETCH_SINGLE_USER_SUCCESS';
  payload: UserRes;
}

interface ClearUserSession {
  type: 'CLEAR_USER_SESSION';
}

interface GetMyDetails {
  type: 'GET_MY_DETAILS_SUCCESS';
  payload: UserRes;
}

type Action = Login | Logout | FetchSingleUser | ClearUserSession | GetMyDetails;

const initialState: UserState = {
  details: null,
  singleUser: {
    rentCount: 0,
    id: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    role: UserRole.admin,
  },
};

export default (state: UserState = initialState, action: Action): any => {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      const { user } = action.payload;
      return {
        ...state,
        details: user,
      };
    }
    case 'GET_MY_DETAILS_SUCCESS': {
      const user = action.payload;
      return {
        ...state,
        details: user,
      };
    }

    case 'LOGOUT':
      return { ...state, details: null };

    case 'CLEAR_USER_SESSION':
      SessionService.clearSessionStorage();
      return { ...state, details: null };

    case 'FETCH_SINGLE_USER_SUCCESS':
      return {
        ...state,
        singleUser: action.payload,
      };
    default:
      return state;
  }
};
