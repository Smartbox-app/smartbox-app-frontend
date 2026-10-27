import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { allNS, defaultNS } from 'src/i18n/constants';
import applicationCz from 'src/i18n/locales/cz/application';
import applicationDe from 'src/i18n/locales/de/application';
import applicationEn from 'src/i18n/locales/en/application';
import application from 'src/i18n/locales/pl/application';
import applicationUa from 'src/i18n/locales/ua/application';
import type { I18nResourceKey, Options } from 'src/i18n/types';
import SessionService from 'src/services/session-service';

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
