import { expect, Page, test } from '@playwright/test';

import { e2eBoxGroupName, e2eRenter, e2eStockName } from './accounts';
import { hideCookieBar, login, logout } from './helpers';

const api = 'http://localhost:3002';

const readSeededOrderIds = async (page: Page) => {
  const stocks = await page.request.get(`${api}/stock/list?tenantId=e2e`);
  const stockBody = await stocks.json();
  const stockId = stockBody.payload.find(
    (stock: { name: string; id: string }) => stock.name === e2eStockName,
  ).id as string;
  const groups = await page.request.get(
    `${api}/box-group-new/all/${stockId}?tenantId=e2e`,
  );
  const groupBody = await groups.json();
  const boxGroupId = groupBody.payload.find(
    (group: { name: string; id: string }) => group.name === e2eBoxGroupName,
  ).id as string;

  return { stockId, boxGroupId };
};

test('returns to stock selection after login', async ({ page }) => {
  await hideCookieBar(page);
  await page.goto('/user/order');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();

  await login(page, e2eRenter.email, e2eRenter.password, /\/user\/order\/?(\?|$)/);
  await expect(page).toHaveURL((url) => url.pathname === '/user/order');
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać plac' }),
  ).toBeVisible();
});

test('returns to group selection after login and preselects the box group', async ({
  page,
}) => {
  test.setTimeout(90_000);
  await hideCookieBar(page);
  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
  const { stockId, boxGroupId } = await readSeededOrderIds(page);
  await logout(page);

  await page.goto(`/user/order/${stockId}?group=${boxGroupId}`);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('button', { name: 'Zaloguj się' })).toBeVisible();

  await login(
    page,
    e2eRenter.email,
    e2eRenter.password,
    new RegExp(`/user/order/${stockId}(\\?|$)`),
  );

  await expect(page).toHaveURL(
    (url) =>
      url.pathname === `/user/order/${stockId}` &&
      url.searchParams.get('group') === boxGroupId,
  );
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar minimagazynu' }),
  ).toBeVisible();
  await expect(page.locator(`[id="${boxGroupId}"]`)).toBeChecked();
});
