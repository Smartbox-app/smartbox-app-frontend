import { expect, Page, test } from '@playwright/test';
import { e2eAdmin, e2eOpenEnded, e2eStockName, e2eBoxGroupName } from './accounts';
import {
  clickNext,
  expectApiOk,
  login,
  logout,
} from './helpers';

const periodDays = 30;
const netPerPeriod = 100;
const taxRate = 0.23;

const roundMoney = (value: number) => Math.round(value * 100) / 100;

const grossLabel = (net: number) =>
  `${roundMoney(net * (1 + taxRate)).toFixed(2).replace('.', ',')} zł`;

/** Next 30-day window after the first period has already spent `periodDays` of the code. */
const nextNet = (code: {
  kind: 'percent' | 'value' | 'to';
  days: number | null;
  amount: number;
}) => {
  if (code.kind === 'value' || !code.days) return netPerPeriod;
  const left = code.days - periodDays;
  if (left <= 0) return netPerPeriod;
  if (code.kind === 'percent') {
    const covered = Math.min(left, periodDays) / periodDays;
    return roundMoney((netPerPeriod * (100 - code.amount * covered)) / 100);
  }
  if (left >= periodDays) {
    return roundMoney((periodDays / code.days) * code.amount);
  }
  const discounted = (left / code.days) * code.amount;
  const rest = (1 - left / periodDays) * netPerPeriod;
  return roundMoney(discounted + rest);
};

type CodeCase = {
  code: string;
  kind: 'percent' | 'value' | 'to';
  days: number | null;
  amount: number;
};

const cases: CodeCase[] = [
  { code: 'E2E-P30', kind: 'percent', days: 30, amount: 20 },
  { code: 'E2E-P45', kind: 'percent', days: 45, amount: 20 },
  { code: 'E2E-P60', kind: 'percent', days: 60, amount: 20 },
  { code: 'E2E-P90', kind: 'percent', days: 90, amount: 20 },
  { code: 'E2E-V100', kind: 'value', days: null, amount: 100 },
  { code: 'E2E-T30', kind: 'to', days: 30, amount: 100 },
  { code: 'E2E-T45', kind: 'to', days: 45, amount: 100 },
  { code: 'E2E-T60', kind: 'to', days: 60, amount: 100 },
  { code: 'E2E-T90', kind: 'to', days: 90, amount: 100 },
];

const giftForm = (page: Page) =>
  page
    .getByRole('button', { name: 'Utwórz', exact: true })
    .locator('xpath=ancestor::form[1]');

const pickExpireAt = async (page: Page) => {
  await giftForm(page).locator('input.flatpickr-input').last().click({ timeout: 10_000 });
  const calendar = page.locator('.flatpickr-calendar.open');
  await expect(calendar).toBeVisible();
  await calendar.locator('.flatpickr-next-month').click();
  await calendar
    .locator(
      '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay):not(.flatpickr-disabled)',
    )
    .getByText('15', { exact: true })
    .click({ timeout: 10_000 });
};

const createDiscountCode = async (page: Page, item: CodeCase) => {
  await page.getByRole('button', { name: 'Utwórz kod rabatowy' }).click();
  const form = giftForm(page);
  await expect(
    form.getByRole('spinbutton', { name: 'Minimalna wymagana ilość dni najmu' }),
  ).toBeVisible();
  await form.getByRole('textbox', { name: 'Kod', exact: true }).fill(item.code);
  await form.locator('.input-select__control').first().click({ timeout: 10_000 });
  const typeText = {
    percent: 'procentową',
    value: '[zł]',
    to: 'podanej ceny',
  }[item.kind];
  await page
    .locator('.input-select__option')
    .filter({ hasText: typeText })
    .click({ timeout: 10_000 });
  await form
    .getByRole('spinbutton', { name: 'Minimalna wymagana ilość dni najmu' })
    .fill('1');
  await form.getByRole('spinbutton', { name: 'Ilość dostępnych użyć' }).fill('1');
  if (item.kind === 'to') {
    await form.getByRole('spinbutton', { name: 'Redukcja ceny do' }).fill(String(item.amount));
  } else {
    await form.getByRole('spinbutton', { name: 'Zniżka', exact: true }).fill(String(item.amount));
  }
  if (item.days) {
    await form
      .getByRole('spinbutton', { name: /Czas najmu w dniach/ })
      .fill(String(item.days));
  }
  await pickExpireAt(page);

  const created = page.waitForResponse(
    (response) =>
      response.url().includes('gift/new') && response.request().method() === 'POST',
  );
  await form.getByRole('button', { name: 'Utwórz', exact: true }).click();
  await expectApiOk(await created);
  await expect(page.getByText(item.code, { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('heading', { name: 'Wygenerowano kod' })).toBeHidden();
};

const rentWithCode = async (page: Page, code: string) => {
  await login(page, e2eOpenEnded.email, e2eOpenEnded.password, /\/user/);
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();
  await expect(page.getByRole('heading', { name: 'Proszę wybrać plac' })).toBeVisible();
  await page.getByText(e2eStockName, { exact: true }).click();
  await clickNext(page);
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar minimagazynu' }),
  ).toBeVisible();
  await page.getByText(e2eBoxGroupName, { exact: true }).click();
  await clickNext(page);
  await expect(page.getByRole('heading', { name: 'Rodzaj umowy' })).toBeVisible();
  await page.getByText('Umowa bezterminowa', { exact: true }).click();
  await clickNext(page);
  await expect(
    page.getByRole('heading', { name: 'Dane najemcy', exact: true }),
  ).toBeVisible();

  await page.getByText('Posiadam kod rabatowy', { exact: true }).click();
  await page.getByLabel('Podaj Twój kod rabatowy').fill(code);
  const details = page.waitForResponse(
    (response) =>
      response.url().includes('gift/details/') && response.request().method() === 'POST',
  );
  const priced = page.waitForResponse(
    (response) =>
      response.url().includes('price-open-ended/') &&
      response.url().includes(code) &&
      response.request().method() === 'GET',
  );
  await page.getByRole('button', { name: 'Zatwierdź' }).click();
  await expectApiOk(await details);
  await priced;

  const rentCreated = page.waitForResponse(
    (response) =>
      response.url().includes('rent/new') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Przejdź do umowy' }).click();
  const created = await expectApiOk(await rentCreated);
  const rentId = (created.payload as { rentId?: string }).rentId;
  expect(rentId).toBeTruthy();
  await expect(page.getByRole('heading', { name: 'Umowa wynajmu' })).toBeVisible();
  await acceptRentPayment(page);
  await login(page, e2eOpenEnded.email, e2eOpenEnded.password, /\/user/);
  await expect(page.locator(`a[href*="/single-rent/${rentId}"]`)).toBeVisible();
  await logout(page);
  return rentId as string;
};

const acceptRentPayment = async (page: Page) => {
  await logout(page);
  await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
  await page.goto('/client/locations/stocks/list');
  await page
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: e2eStockName, exact: true }) })
    .getByRole('button', { name: /Zarządzaj|Manage/ })
    .click();
  await page.getByRole('link', { name: 'Płatności', exact: true }).click();
  await expect(
    page.getByRole('row').filter({ hasText: e2eOpenEnded.email }).first(),
  ).toBeVisible();
  const forceButton = page.getByRole('button', {
    name: /Wymuś akceptację płatności|Force payment acceptance/,
  });
  if (await forceButton.first().isVisible()) {
    await forceButton.first().click();
    const forced = page.waitForResponse(
      (response) =>
        response.url().includes('rent/payment/force/') &&
        response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: /^(Tak|Yes)$/ }).click();
    await expectApiOk(await forced);
  }
  await logout(page);
};

test('open-ended next period keeps a discount code that still has days left', async ({
  page,
}) => {
  page.setDefaultTimeout(20_000);
  test.setTimeout(20 * 60_000);
  await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
  await page.goto('/client/locations/stocks/list');
  await page
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: e2eStockName, exact: true }) })
    .getByRole('button', { name: /Zarządzaj|Manage/ })
    .click();
  await page.getByRole('link', { name: 'Promocje', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Utwórz kod rabatowy' })).toBeVisible();

  for (const item of cases) {
    await createDiscountCode(page, item);
  }

  const rents: { item: CodeCase; rentId: string }[] = [];
  await logout(page);
  for (const item of cases) {
    rents.push({ item, rentId: await rentWithCode(page, item.code) });
  }

  await login(page, e2eOpenEnded.email, e2eOpenEnded.password, /\/user/);
  for (const { item, rentId } of rents) {
    await page.goto('/user');
    await page.locator(`a[href*="/single-rent/${rentId}"]`).click();
    await expect
      .soft(
        page
          .getByRole('heading', { name: 'Cena kolejnego okresu' })
          .locator('xpath=following::summary[1]'),
      )
      .toContainText(grossLabel(nextNet(item)));
  }
});
