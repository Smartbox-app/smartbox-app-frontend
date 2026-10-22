import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import application from './locales/pl/application';
import applicationEn from './locales/en/application';
import applicationCz from './locales/cz/application';
import applicationUa from './locales/ua/application';
import applicationDe from './locales/de/application';
import SessionService from '../services/session-service';
import type { I18nResourceKey, Options } from './types';

import { allNS, defaultNS } from './constants';

export { allNS, defaultNS };

export const resources = {
  pl: {
    application,
  },
  en: {
    application: applicationEn,
  },
  cz: {
    application: applicationCz,
  },
  ua: {
    application: applicationUa,
  },
  de: {
    application: applicationDe,
  },
};

const initialLanguage = SessionService.getCurrentLanguage();

i18next.use(initReactI18next).init({
  lng: initialLanguage,
  fallbackLng: 'pl',
  ns: allNS,
  defaultNS,
  resources,
  interpolation: {
    escapeValue: false,
  },
  returnEmptyString: false,
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = initialLanguage;
}

export const t = (key: I18nResourceKey, options?: Options): string =>
  (i18next.t as (key: I18nResourceKey, options?: Options) => string)(
    key,
    options,
  );

export { i18next };
