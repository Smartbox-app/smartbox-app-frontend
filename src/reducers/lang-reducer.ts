import { MyRentList } from "smartbox-types";
import { i18n } from '../helpers/i18n';
import SessionService from '../services/session-service';

interface ToggleLangList {
  type: 'TOGGLE_LANG_LIST';
}

interface HideLangList {
  type: 'HIDE_LANG_LIST';
}

interface ChangeLanguage {
  type: 'CHANGE_LANGUAGE';
  payload: string;
}

type Action = ToggleLangList | HideLangList | ChangeLanguage;

export type LangStatus = {
  toggled: boolean;
  current: string;
  available: string[];
};

const initialState: LangStatus = {
  toggled: false,
  current: SessionService.getCurrentLanguage(),
  available: ['pl', 'en'],
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case 'TOGGLE_LANG_LIST': {
      return { ...state, toggled: !state.toggled };
    }
    case 'HIDE_LANG_LIST': {
      return { ...state, toggled: false };
    }
    case 'CHANGE_LANGUAGE': {
      i18n.changeLang(action.payload);
      return { ...state, current: action.payload };
    }
    default:
      return state;
  }
};
