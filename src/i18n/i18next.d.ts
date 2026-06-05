import 'i18next';

import type application from './locales/pl/application';

declare module 'i18next' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CustomTypeOptions {
    defaultNS: 'application';
    resources: {
      application: typeof application;
    };
  }
}
