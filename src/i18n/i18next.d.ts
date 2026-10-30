import 'i18next';

import type application from 'src/i18n/locales/pl/application';

declare module 'i18next' {
   
  interface CustomTypeOptions {
    defaultNS: 'application';
    resources: {
      application: typeof application;
    };
  }
}
