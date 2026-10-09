import { UserRole, UserRes } from 'smartbox-types';
import SessionService from '../services/session-service';

export type UserState = {
  singleUser: UserRes;
};

interface FetchSingleUser {
  type: 'FETCH_SINGLE_USER_SUCCESS';
  payload: UserRes;
}

interface ClearUserSession {
  type: 'CLEAR_USER_SESSION';
}



type Action = FetchSingleUser | ClearUserSession;

const initialState: UserState = {
  singleUser: {
    rentCount: 0,
    id: '',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    role: UserRole.admin,
  } as UserRes,
};

export default (state: UserState = initialState, action: Action): UserState => {
  switch (action.type) {
    case 'CLEAR_USER_SESSION':
      SessionService.clearSessionStorage();
      return state;

    case 'FETCH_SINGLE_USER_SUCCESS':
      return {
        ...state,
        singleUser: action.payload,
      };
    default:
      return state;
  }
};
