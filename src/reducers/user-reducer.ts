import SessionService from 'src/services/session-service';

export type UserState = Record<string, never>;

interface ClearUserSession {
  type: 'CLEAR_USER_SESSION';
}

type Action = ClearUserSession;

const initialState: UserState = {};

export default (state: UserState = initialState, action: Action): UserState => {
  switch (action.type) {
    case 'CLEAR_USER_SESSION':
      SessionService.clearSessionStorage();
      return state;
    default:
      return state;
  }
};
