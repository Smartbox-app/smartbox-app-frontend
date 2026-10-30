import { expect, Page, test } from '@playwright/test';
import { e2eAdmin, e2eBoxGroupName, e2eRenter, e2eStockName } from './accounts';
import {
  clickNext,
  expectApiOk,
  expectRentDayCount,
  forceAcceptPayments,
  login,
  logout,
  selectInlineCalendarDay,
} from './helpers';

const baseNetPrice = 100;
const thresholdNetPrice = 200;
const monthDays = 30;
const taxRate = 0.23;

const grossLabel = (net: number) => {
  const gross = Math.round(net * (1 + taxRate) * 100) / 100;
  return `${gross.toFixed(2).replace('.', ',')} zł`;
};

const boxesLeftLabel = (left: number) => {
  if (left === 1) return 'Został';
  if (left < 5) return 'Zostały';
  return 'Zostało';
};

const grossTotal = (page: Page) =>
  page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { name: 'Cena brutto za wybrany okres' }),
    })
    .locator('strong')
    .first();

const openGroupPricing = async (page: Page) => {
  await page.goto('/client/locations/stocks/list');
  await page
    .getByRole('row', { name: new RegExp(e2eStockName) })
    .getByRole('button', { name: /Zarządzaj|Manage/ })
    .click();
  // exact: avoid matching sidebar "Grupy placów"
  await page.getByRole('link', { name: /^Grupy$|^Groups$/, exact: true }).click();
  await page
    .getByRole('row', { name: new RegExp(e2eBoxGroupName) })
    .getByRole('link', { name: /Cennik|Price list/ })
    .click();
  await expect(
    page.getByRole('heading', {
      name: new RegExp(`(Cennik|Price list) ${e2eBoxGroupName}`),
    }),
  ).toBeVisible();
  await expect(page.locator('[name="price_0"]')).toHaveValue(String(baseNetPrice));
};

const saveThreshold = async (page: Page, boxesLeft: number, price: number) => {
  const boxesLeftInput = page.locator('[name="boxesLeft_0_0"]');
  if ((await boxesLeftInput.count()) === 0) {
    await page.getByRole('button', { name: 'Dodaj próg cenowy' }).click();
  }
  await boxesLeftInput.fill(String(boxesLeft));
  await page.locator('[name="thresholdPrice_0_0"]').fill(String(price));
  const saved = page.waitForResponse(
    (response) =>
      response.url().includes('box-group-new/pricing/') &&
      response.request().method() === 'PATCH',
  );
  await page.getByRole('button', { name: 'Zapisz' }).click();
  await expectApiOk(await saved);
  await expect(page.getByText('Edytowano grupę')).toBeVisible();
};

const expectBoxesLeft = async (page: Page, left: number) => {
  const counter = page.locator('span').filter({
    hasText: `${boxesLeftLabel(left)} ${left}!`,
  });
  await expect(counter).toBeVisible();
  await expect(counter.locator('strong')).toHaveText(String(left));
};

const selectFullPeriod = async (page: Page) => {
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  end.setDate(end.getDate() + monthDays - 1);
  await selectInlineCalendarDay(page, end, { calendarIndex: 1 });
  await expectRentDayCount(page, monthDays);
};

const readFreeBoxes = async (page: Page) => {
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();
  await expect(page.getByRole('heading', { name: 'Proszę wybrać plac' })).toBeVisible();
  const groups = page.waitForResponse(
    (response) =>
      response.url().includes('box-group-new/all/') &&
      response.request().method() === 'GET',
  );
  await page.getByText(e2eStockName, { exact: true }).click();
  await clickNext(page);
  const body = (await (await groups).json()) as {
    payload?: { name: string; left: number | null }[];
  };
  const left = body.payload?.find((group) => group.name === e2eBoxGroupName)?.left;
  if (left == null || left < 2) {
    throw new Error(`Need at least 2 free boxes to cross a threshold, found ${left}`);
  }
  await expectBoxesLeft(page, left);
  return left;
};

const quoteFullMonth = async (page: Page, boxesLeft: number) => {
  await page.goto('/user');
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();
  await expect(page.getByRole('heading', { name: 'Proszę wybrać plac' })).toBeVisible();
  await page.getByText(e2eStockName, { exact: true }).click();
  await clickNext(page);
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar minimagazynu' }),
  ).toBeVisible();
  await expectBoxesLeft(page, boxesLeft);
  await page.getByText(e2eBoxGroupName, { exact: true }).click();
  await clickNext(page);
  await expect(grossTotal(page)).toBeVisible();
  await selectFullPeriod(page);
};

const reserveBox = async (page: Page) => {
  await clickNext(page);
  await expect(
    page.getByRole('heading', { name: 'Dane najemcy', exact: true }),
  ).toBeVisible();
  const rentCreated = page.waitForResponse(
    (response) =>
      response.url().includes('rent/new') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Przejdź do umowy' }).click();
  await expectApiOk(await rentCreated);
  await expect(page.getByText(/Zarezerwowano minimagazyn/)).toBeVisible();
};

const expectRentedBoxes = async (page: Page, prices: string[]) => {
  await page.goto('/user');
  const links = page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { name: 'Zarządzaj swoimi minimagazynami' }),
    })
    .locator('a[href*="/single-rent/"]');
  await expect(links).toHaveCount(prices.length);
  const hrefs = await links.evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href') || ''),
  );

  const seen: string[] = [];
  for (const href of hrefs) {
    await page.goto(href);
    await expect(page.locator('.row-content').getByText('Wynajęty', { exact: true })).toBeVisible();
    const history = page.locator('section').filter({
      has: page.getByRole('heading', { name: 'Historia najmu' }),
    });
    const line = await history.getByText(/^Cena - /).innerText();
    seen.push(line.replace(/^Cena - /, '').trim());
  }
  expect(seen.sort()).toEqual([...prices].sort());
};

test.describe.serial('price thresholds', () => {

  test('saves a price threshold on the box group', async ({ page }) => {
    await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
    await openGroupPricing(page);
    await saveThreshold(page, 1, thresholdNetPrice);
    await page.reload();
    await expect(page.locator('[name="price_0"]')).toHaveValue(String(baseNetPrice));
    await expect(page.locator('[name="boxesLeft_0_0"]')).toHaveValue('1');
    await expect(page.locator('[name="thresholdPrice_0_0"]')).toHaveValue(
      String(thresholdNetPrice),
    );
  });

  test('rents one box at the base price and the next at the threshold price', async ({
    page,
  }) => {
    test.setTimeout(180_000);
    await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
    const freeBoxes = await readFreeBoxes(page);
    await logout(page);

    await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
    await openGroupPricing(page);
    await saveThreshold(page, freeBoxes - 1, thresholdNetPrice);
    await logout(page);

    await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
    await quoteFullMonth(page, freeBoxes);
    await expect(grossTotal(page)).toHaveText(grossLabel(baseNetPrice));
    await reserveBox(page);

    await quoteFullMonth(page, freeBoxes - 1);
    await expect(grossTotal(page)).toHaveText(grossLabel(thresholdNetPrice));
    await reserveBox(page);
    await logout(page);

    await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
    await forceAcceptPayments(page, e2eRenter.email, 2);
    await logout(page);

    await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
    await expectRentedBoxes(page, [
      grossLabel(baseNetPrice),
      grossLabel(thresholdNetPrice),
    ]);
  });
});
