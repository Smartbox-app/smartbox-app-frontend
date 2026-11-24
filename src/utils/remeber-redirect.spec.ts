import { UserRole } from 'smartbox-types';

import { history } from 'src/history';

import {
  clearRememberedRedirect,
  getRememberedRedirect,
  orderEntryAddress,
  rememberRedirect,
} from './remeber-redirect';

describe('order entry redirect', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('keeps stock select, group select, and the box group query', () => {
    expect(orderEntryAddress('/user/order')).toBe('/user/order');
    expect(
      orderEntryAddress('/user/order/stock-1', '?group=group-1'),
    ).toBe('/user/order/stock-1?group=group-1');
    expect(orderEntryAddress('/user/order/rent/rent-1/duration')).toBeNull();
    expect(
      orderEntryAddress('/user/order/stock-1/group-1/duration'),
    ).toBeNull();
  });

  it('stores the current order entry for after login', () => {
    history.replace('/user/order/stock-1?group=group-1');

    rememberRedirect(UserRole.user);

    expect(getRememberedRedirect()).toEqual({
      to: '/user/order/stock-1?group=group-1',
      role: UserRole.user,
    });
  });

  it('does not store other pages', () => {
    history.replace('/user/main');

    rememberRedirect(UserRole.user);

    expect(getRememberedRedirect()).toBeNull();
  });

  it('clears a stored address', () => {
    history.replace('/user/order');
    rememberRedirect(UserRole.user);

    clearRememberedRedirect();

    expect(getRememberedRedirect()).toBeNull();
  });
});
