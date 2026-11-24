import { renderHook } from '@testing-library/react';

import { UserRole } from 'smartbox-types';

import { history } from 'src/history';

// The test transformer does not hoist jest.mock, so the hook loads after these mocks.
// eslint-disable-next-line no-var
var mockRole: UserRole | undefined = UserRole.user;
jest.mock('src/queries', () => ({
  useGetMyDetailsQuery: () => ({
    data: mockRole ? { role: mockRole } : undefined,
  }),
}));

const { useOrderPaths } =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./useOrderPaths') as typeof import('./useOrderPaths');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { matchPath } = require('react-router') as typeof import('react-router');

describe('useOrderPaths', () => {
  beforeEach(() => {
    mockRole = UserRole.user;
    jest.spyOn(history, 'push').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('opens stock selection and size from the ids', () => {
    const { result } = renderHook(() => useOrderPaths());

    result.current.goToStockSelect();
    result.current.goToSize('stock-1');
    result.current.goToStockSelect('stock-1');
    result.current.goToSize('stock-1', 'group-1');

    expect(history.push).toHaveBeenNthCalledWith(1, '/user/order');
    expect(history.push).toHaveBeenNthCalledWith(2, '/user/order/stock-1');
    expect(history.push).toHaveBeenNthCalledWith(3, '/user/order?stock=stock-1');
    expect(history.push).toHaveBeenNthCalledWith(
      4,
      '/user/order/stock-1?group=group-1',
    );
  });

  it('nests a new rent under the stock and box group', () => {
    const { result } = renderHook(() => useOrderPaths());
    const target = { stockId: 'stock-1', boxGroupId: 'group-1' };

    result.current.goToDuration(target);
    result.current.goToSummary(target);
    result.current.goToAgreement(target);

    expect(history.push).toHaveBeenNthCalledWith(
      1,
      '/user/order/stock-1/group-1/duration',
    );
    expect(history.push).toHaveBeenNthCalledWith(
      2,
      '/user/order/stock-1/group-1/summary',
    );
    expect(history.push).toHaveBeenNthCalledWith(
      3,
      '/user/order/stock-1/group-1/agreement',
    );
  });

  it('keeps an extension under the rent id', () => {
    const { result } = renderHook(() => useOrderPaths());

    result.current.goToDuration({ rentId: 'rent-1' });
    result.current.goToSummary({ rentId: 'rent-1' });

    expect(history.push).toHaveBeenNthCalledWith(
      1,
      '/user/order/rent/rent-1/duration',
    );
    expect(history.push).toHaveBeenNthCalledWith(
      2,
      '/user/order/rent/rent-1/summary',
    );
  });

  it('does not navigate before the user is known', () => {
    mockRole = undefined;
    const { result } = renderHook(() => useOrderPaths());

    result.current.goToStockSelect();
    result.current.goToDuration({ rentId: 'rent-1' });

    expect(history.push).not.toHaveBeenCalled();
  });

  it('does not treat a new rent as an extension', () => {
    const { result } = renderHook(() => useOrderPaths());
    const routes = result.current.routes;
    const ordered = [
      { path: routes?.stock, exact: true },
      { path: routes?.extensionDuration },
      { path: routes?.extensionSummary },
      { path: routes?.extensionAgreement },
      { path: routes?.extensionPayment },
      { path: routes?.duration },
      { path: routes?.summary },
      { path: routes?.agreement },
      { path: routes?.payment },
      { path: routes?.size, exact: true },
    ];
    const matched = (url: string) =>
      ordered.find((route) => matchPath(url, route))?.path;

    expect(matched('/user/order/stock-1/group-1/duration')).toBe(
      '/user/order/:stockId/:boxGroupId/duration',
    );
    expect(matched('/user/order/rent/rent-1/duration')).toBe(
      '/user/order/rent/:rentId/duration',
    );
    expect(matched('/user/order/stock-1')).toBe('/user/order/:stockId');
  });
});
