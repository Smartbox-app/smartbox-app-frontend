import { expect, Page, test } from '@playwright/test';

import {
  e2eBoxGroupName,
  e2eOtherBoxGroupName,
  e2eOtherStockName,
  e2eRenter,
  e2eStockName,
} from './accounts';
import { hideCookieBar, login } from './helpers';

const api = 'http://localhost:3002';

const readSeededOrderIds = async (page: Page) => {
  const stocks = await page.request.get(`${api}/stock/list?tenantId=e2e`);
  const stockBody = await stocks.json();
  const stockList = stockBody.payload as { name: string; id: string }[];
  const stockId = stockList.find((stock) => stock.name === e2eStockName)?.id;
  const otherStockId = stockList.find(
    (stock) => stock.name === e2eOtherStockName,
  )?.id;
  const groups = await page.request.get(
    `${api}/box-group-new/all/${stockId}?tenantId=e2e`,
  );
  const groupBody = await groups.json();
  const groupList = groupBody.payload as { name: string; id: string }[];
  const boxGroupId = groupList.find((group) => group.name === e2eBoxGroupName)
    ?.id;
  const otherBoxGroupId = groupList.find(
    (group) => group.name === e2eOtherBoxGroupName,
  )?.id;

  if (!stockId || !otherStockId || !boxGroupId || !otherBoxGroupId) {
    throw new Error('Seeded order ids were not found');
  }

  return { stockId, otherStockId, boxGroupId, otherBoxGroupId };
};

test.beforeEach(async ({ page }) => {
  await hideCookieBar(page);
  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
});

test('preselects a stock and updates the search param when another is chosen', async ({
  page,
}) => {
  const { stockId, otherStockId } = await readSeededOrderIds(page);

  await page.goto(`/user/order?stock=${stockId}`);
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać plac' }),
  ).toBeVisible();
  await expect(page.locator(`[id="${stockId}"]`)).toBeChecked();

  await page.getByText(e2eOtherStockName, { exact: true }).click();

  await expect(page).toHaveURL(
    (url) => url.searchParams.get('stock') === otherStockId,
  );
  await expect(page.locator(`[id="${otherStockId}"]`)).toBeChecked();
});

test('preselects a box group and updates the search param when another is chosen', async ({
  page,
}) => {
  const { stockId, boxGroupId, otherBoxGroupId } = await readSeededOrderIds(page);

  await page.goto(`/user/order/${stockId}?group=${boxGroupId}`);
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar minimagazynu' }),
  ).toBeVisible();
  await expect(page.locator(`[id="${boxGroupId}"]`)).toBeChecked();

  await page.getByText(e2eOtherBoxGroupName, { exact: true }).click();

  await expect(page).toHaveURL(
    (url) => url.searchParams.get('group') === otherBoxGroupId,
  );
  await expect(page.locator(`[id="${otherBoxGroupId}"]`)).toBeChecked();
});

test('shows an error page when the stock and box group do not belong together', async ({
  page,
}) => {
  const { otherStockId, boxGroupId } = await readSeededOrderIds(page);

  await page.goto(`/user/order/${otherStockId}/${boxGroupId}/duration`);

  await expect(
    page.getByRole('heading', { name: 'Coś poszło nie tak' }),
  ).toBeVisible();
  await expect(
    page.getByText('Nie znaleziono placu, którego szukasz.'),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Wróć do wyboru placu' }).click();

  await expect(page).toHaveURL((url) => url.pathname === '/user/order');
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać plac' }),
  ).toBeVisible();
});
