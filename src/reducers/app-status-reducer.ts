interface AppStatusChange {
  type: 'APP_STATUS_CHANGE';
  payload: {
    type: string;
  };
}
export type AppStatus = boolean;
type Action = AppStatusChange;

const initialState: AppStatus = true;

export default (state: AppStatus = initialState, action: Action) => {
  switch (action.type) {
    case 'APP_STATUS_CHANGE':
      switch (action.payload.type) {
        case 'load':
          return true;
        case 'online':
          return true;
        case 'offline':
          return false;
        default:
          return true;
      }
    default:
      return state;
  }
};
