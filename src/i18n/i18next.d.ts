import 'i18next';

import type application from './locales/pl/application';

declare module 'i18next' {
   
  interface CustomTypeOptions {
    defaultNS: 'application';
    resources: {
      application: typeof application;
    };
  }
}
