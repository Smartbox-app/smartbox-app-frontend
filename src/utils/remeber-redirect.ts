import { UserRole } from 'smartbox-types';
import { history } from 'src/history';

export const rememberRedirect = (role: UserRole) => {
  sessionStorage.setItem('user-redirect', JSON.stringify({ to: history.location.pathname, role }));
};

export const getRememberedRedirect = () => JSON.parse(sessionStorage.getItem('user-redirect') || 'null');

export const clearRememberedRedirect = () => {
  sessionStorage.removeItem('user-redirect');
};
