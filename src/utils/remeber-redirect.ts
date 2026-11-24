import { UserRole } from 'smartbox-types';

import { history } from 'src/history';

const orderEntryPath = /^\/user\/order(?:\/(?!rent(?:\/|$))[^/]+)?\/?$/;

/** Stock select (`/user/order`) or group select (`/user/order/:stockId`), including the query string. */
export const orderEntryAddress = (pathname: string, search = '') => {
  if (!orderEntryPath.test(pathname)) return null;
  return `${pathname}${search}`;
};

export const rememberRedirect = (role: UserRole) => {
  const to = orderEntryAddress(
    history.location.pathname,
    history.location.search,
  );
  if (!to) return;

  sessionStorage.setItem(
    'user-redirect',
    JSON.stringify({ to, role }),
  );
};

export const getRememberedRedirect = (): { to: string; role: UserRole } | null => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem('user-redirect') || 'null');
    if (!parsed || typeof parsed.to !== 'string' || !parsed.role) return null;
    if (!parsed.to.startsWith('/') || parsed.to.startsWith('//')) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearRememberedRedirect = () => {
  sessionStorage.removeItem('user-redirect');
};
