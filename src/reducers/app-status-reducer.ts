interface AppStatusChange {
  type: 'APP_STATUS_CHANGE';
  payload: {
    type: string;
  };
}

type Action = AppStatusChange;

const initialState = true;

export default (state = initialState, action: Action) => {
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
