import { UserRole, UserRes } from 'smartbox-types';
import SessionService from '../services/session-service';

export interface UserCommonEntity extends UserRes {
  isRulesAndRodoAccepted: boolean;
}

export type UserState = {
  details: UserCommonEntity;
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

interface AcceptationCookies {
  type: 'ACCEPTATION_COOKIES';
}

interface GetMyDetails {
  type: 'GET_MY_DETAILS_SUCCESS';
  payload: UserRes;
}

type Action = Login | Logout | FetchSingleUser | ClearUserSession | AcceptationCookies | GetMyDetails;

const initialState: UserState = {
  details: SessionService.getUser(),
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
      const user = { ...state.details, ...action.payload.user, isRulesAndRodoAccepted: false };
      SessionService.setUser(user);
      return {
        ...state,
        details: user,
      };
    }
    case 'GET_MY_DETAILS_SUCCESS': {
      const user = {
        ...action.payload,
        isRulesAndRodoAccepted: state.details.isRulesAndRodoAccepted,
      };
      SessionService.setUser(user);
      return {
        ...state,
        details: user,
      };
    }

    case 'ACCEPTATION_COOKIES': {
      const user = { ...state.details, isRulesAndRodoAccepted: true };
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

    case 'FETCH_SINGLE_USER_SUCCESS':
      return {
        ...state,
        singleUser: action.payload,
      };
    default:
      return state;
  }
};
