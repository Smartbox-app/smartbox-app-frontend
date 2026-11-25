import { Capacitor } from '@capacitor/core';

const readValue = (): string => {
  // return 'testowa'
  if (import.meta.env.VITE_IS_LOCAL === 'true') {
    return import.meta.env.VITE_APP_HOSTNAME;
  }
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_APP_HOSTNAME || '';
  }
  return Capacitor.isNativePlatform() && import.meta.env.VITE_APP_HOSTNAME
    ? import.meta.env.VITE_APP_HOSTNAME
    : window.location.hostname;
};

/** App apex; staging may already be a subdomain. */
const rootDomain = (
  import.meta.env.VITE_ROOT_DOMAIN || 'smartbox-app.pl'
).toLowerCase();

export const getHostName = (): string | null => {
  const hostname = readValue().split(':')[0].toLowerCase().replace(/\.$/, '');
  if (!hostname) return null;

  if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
    return null;
  }
  if (hostname.endsWith(`.${rootDomain}`)) {
    return hostname.slice(0, -(rootDomain.length + 1)).split('.')[0] || null;
  }

  const split = hostname.split('.');
  if (split.length === 2) return null;
  return split[0];
};
