import { Capacitor } from '@capacitor/core';

const readValue = (): string => {
  // return 'testowa'
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_APP_HOSTNAME || '';
  } else {
    return Capacitor.isNativePlatform() && import.meta.env.VITE_APP_HOSTNAME
      ? import.meta.env.VITE_APP_HOSTNAME
      : window.location.hostname;
  }
};

export const getHostName = (): string => {
  return 'test';
  const hostname = readValue();
  const split = hostname.split('.');
  const clientId = split[0];
  return clientId;
};
