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
    localStorage.setItem('cookies', 'true');
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
