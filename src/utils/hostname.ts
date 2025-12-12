import { Capacitor } from '@capacitor/core';

export const getHostName = (): string => {
  // return 'eurotermprodays.iplatform-dev.pl'
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_APP_HOSTNAME || '';
  } else {
    return Capacitor.isNativePlatform() && import.meta.env.VITE_APP_HOSTNAME
      ? import.meta.env.VITE_APP_HOSTNAME
      : window.location.hostname;
  }
};
