
interface StartAnimation {
  type: 'GATE_OPEN_START_ANIMATION';
  payload: boolean;
}

type Action = StartAnimation;

export type GateState = {
  startAnimation: boolean;
};

const initialState = {
  startAnimation: false,
};

export default (state: GateState = initialState, action: Action) => {
  switch (action.type) {
    case 'GATE_OPEN_START_ANIMATION':
      return {
        ...state,
        startAnimation: action.payload,
      };
    default:
      return state;
  }
};
