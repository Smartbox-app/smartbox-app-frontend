import { execFileSync } from 'child_process';
import path from 'path';
import { expect, Locator, Page, Response } from '@playwright/test';
import { e2eAdmin, e2eStockName } from './accounts';

const backendRoot = path.resolve(process.cwd(), '../smartbox-back');

export const readActivationToken = (email: string) => {
  const output = execFileSync(
    'node',
    [
      '-r',
      'ts-node/register',
      '-r',
      'tsconfig-paths/register',
      'src/e2e/print-activation-token.ts',
      email,
    ],
    { cwd: backendRoot, encoding: 'utf8' },
  );
  const line = output
    .trim()
    .split('\n')
    .filter((row) => row.startsWith('{'))
    .pop();

  if (!line) {
    throw new Error(`Activation token script returned no JSON for ${email}`);
  }

  return JSON.parse(line) as { userId: string; updateToken: string };
};

export const setAccountConfirmation = (mode: 'sms' | 'email') => {
  execFileSync(
    'node',
    [
      '-r',
      'ts-node/register',
      '-r',
      'tsconfig-paths/register',
      'src/e2e/set-account-confirmation.ts',
      mode,
    ],
    { cwd: backendRoot },
  );
};

type ApiBody = {
  result?: number;
  payload?: unknown;
  error_code?: unknown;
};

export const expectApiOk = async (response: Response) => {
  const body = (await response.json()) as ApiBody;
  expect(response.ok()).toBeTruthy();
  expect(body.result).toBe(1);
  expect(body.error_code).toBeUndefined();
  return body;
};

export const readApiResponse = (
  page: Page,
  matches: (response: Response) => boolean,
) =>
  page.waitForResponse(matches).then(async (response) => ({
    ok: response.ok(),
    body: (await response.json()) as ApiBody,
  }));

const clickAgainUnless = async (button: Locator, appeared: Promise<unknown>) => {
  try {
    await appeared;
  } catch {
    await button.click();
  }
};

export const submitRegister = async (page: Page) => {
  const button = page.getByRole('button', { name: 'Wyślij' });
  const success = page.getByText('Konto zostało zarejestrowane');
  await button.click();
  await clickAgainUnless(button, success.waitFor({ state: 'visible', timeout: 4_000 }));
  await expect(success).toBeVisible();
};

export const hideCookieBar = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('cookies', 'accepted');
  });
};

export const login = async (
  page: Page,
  email: string,
  password: string,
  url: RegExp,
) => {
  await hideCookieBar(page);
  await page.goto('/login');
  const button = page.getByRole('button', { name: 'Zaloguj się' });
  await expect(button).toBeVisible();
  await page.locator('#email').fill(email);
  await page.locator('#pwd').fill(password);
  await button.click();
  await clickAgainUnless(button, page.waitForURL(url, { timeout: 4_000 }));
  await expect(page).toHaveURL(url);
};

export const openMyBox = async (page: Page, identifier: string) => {
  await page.getByRole('link', { name: new RegExp(identifier) }).click();
};

export const logout = async (page: Page) => {
  const loggedOut = page.waitForResponse(
    (response) =>
      response.url().includes('auth/logout') && response.request().method() === 'GET',
  );
  await page.getByRole('button', { name: 'Wyloguj' }).click();
  await loggedOut;
  await page.goto('/login');
};

export const rentStatus = (page: Page) =>
  page.locator('.row').filter({ hasText: 'Status wynajmu:' }).locator('.row-content');

export const rentStart = (page: Page) =>
  page.locator('.row').filter({ hasText: 'Data rozpoczęcia:' }).locator('.row-content');

export const rentFinish = (page: Page) =>
  page.locator('.row').filter({ hasText: 'Data zakończenia:' }).locator('.row-content');

const manageStockButton = /Zarządzaj|Manage/;
const paymentsLink = /Płatności|Payments/;
const forceAcceptButton = /Wymuś akceptację płatności|Force payment acceptance/;
const confirmYesButton = /^(Tak|Yes)$/;

const pendingPayments = (page: Page, email: string) =>
  page
    .getByRole('row')
    .filter({ hasText: email })
    .filter({
      has: page.getByRole('button', { name: forceAcceptButton }),
    });

export const forceAcceptPayments = async (page: Page, email: string, count = 1) => {
  await page.goto('/client/locations/stocks/list');
  await page
    .getByRole('row', { name: new RegExp(e2eStockName) })
    .getByRole('button', { name: manageStockButton })
    .click();
  await page.getByRole('link', { name: paymentsLink, exact: true }).click();
  await expect(pendingPayments(page, email)).toHaveCount(count);

  for (let left = count; left > 0; left -= 1) {
    await pendingPayments(page, email)
      .first()
      .getByRole('button', { name: forceAcceptButton })
      .click();
    const forced = page.waitForResponse(
      (response) =>
        response.url().includes('rent/payment/force/') &&
        response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: confirmYesButton }).click();
    await expectApiOk(await forced);
    await expect(pendingPayments(page, email)).toHaveCount(left - 1);
  }
};

export const confirmPaymentAsAdmin = async (page: Page, email: string, count = 1) => {
  await logout(page);
  await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
  await forceAcceptPayments(page, email, count);
  await logout(page);
};

export const reachPaymentRedirect = async (page: Page) => {
  await page.getByText('Akceptuję warunki Umowy').click();
  const pay = page.getByRole('button', { name: 'Przejdź do płatności' });
  await expect(pay).toBeEnabled();
  const redirect = page.waitForRequest((request) =>
    request.url().includes('rent/ipg-redirect/'),
  );
  await pay.click({ noWaitAfter: true });
  await redirect;
  await page.goto('/user');
};

export const submitExtensionPayment = async (page: Page) => {
  await clickNext(page);
  await expect(
    page.getByRole('heading', { name: 'Dane najemcy', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Przejdź do umowy' }).click();
  await expect(page.getByRole('heading', { name: 'Umowa wynajmu' })).toBeVisible();
  await reachPaymentRedirect(page);
};

export const clickNext = async (page: Page) => {
  const next = page
    .getByRole('button', { name: 'Dalej' })
    .or(page.getByRole('link', { name: 'Dalej' }));
  await expect(next).toBeEnabled();
  await next.click();
};

const plMonths = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

export const formatDayPl = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
};

/** Click a day on an inline flatpickr (new rent end calendar is usually index 1). */
export const selectInlineCalendarDay = async (
  page: Page,
  date: Date,
  options: {
    calendarIndex?: number;
    priceUrlIncludes?: string;
  } = {},
) => {
  const { calendarIndex = 1, priceUrlIncludes = 'box-group-new/price/' } = options;
  const label = `${plMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  const calendar = page.locator('.flatpickr-calendar').nth(calendarIndex);
  const day = calendar.locator(
    `.flatpickr-day[aria-label="${label}"]:not(.prevMonthDay):not(.nextMonthDay)`,
  );
  for (let step = 0; step < 24 && (await day.count()) === 0; step += 1) {
    await calendar.locator('.flatpickr-next-month').click();
  }
  const priced = page.waitForResponse(
    (response) =>
      response.url().includes(priceUrlIncludes) &&
      response.request().method() === 'GET',
  );
  await day.click();
  await priced;
};

export const expectRentDayCount = async (page: Page, days: number) => {
  await expect(
    page.getByText('Ilość dni najmu w wybranym zakresie:').locator('strong'),
  ).toHaveText(String(days), { timeout: 20_000 });
};

/** Seeded E2E group: 100 net / month, proportional, 23% tax. */
export const e2eMonthNetPrice = 100;
export const e2eTaxRate = 0.23;
export const e2ePricingMonthDays = 30;

export const dayFromToday = (offset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

export const proportionalGrossLabel = (
  days: number,
  netPerMonth = e2eMonthNetPrice,
) => {
  const gross =
    Math.round(
      ((netPerMonth / e2ePricingMonthDays) * days * (1 + e2eTaxRate) +
        Number.EPSILON) *
        100,
    ) / 100;
  return `${gross.toFixed(2).replace('.', ',')} zł`;
};

export const grossTotal = (page: Page) =>
  page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { name: 'Cena brutto za wybrany okres' }),
    })
    .locator('strong')
    .first();

export const expectGrossTotal = async (page: Page, days: number) => {
  await expect(grossTotal(page)).toHaveText(proportionalGrossLabel(days), {
    timeout: 20_000,
  });
};
