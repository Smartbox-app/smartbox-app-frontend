import { execFileSync } from 'child_process';
import path from 'path';
import { expect, Locator, Page, Response } from '@playwright/test';

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

const ipgPaymentUrl =
  /https:\/\/(?:test|www)\.ipg-online\.com\/connect\/gateway\/processing/;

export const acceptAgreementAndPay = async (page: Page) => {
  await page.getByText('Akceptuję warunki Umowy').click();
  const pay = page.getByRole('button', { name: 'Przejdź do płatności' });
  await expect(pay).toBeEnabled();
  const sentToIpg = page.waitForRequest(
    (request) => request.method() === 'POST' && ipgPaymentUrl.test(request.url()),
  );
  await pay.click();
  expect((await sentToIpg).url()).toMatch(ipgPaymentUrl);
  await page.waitForURL(/https:\/\/(?:test|www)\.ipg-online\.com\//, {
    waitUntil: 'commit',
    timeout: 30_000,
  });
};

export const submitExtensionPayment = async (page: Page) => {
  await clickNext(page);
  await expect(
    page.getByRole('heading', { name: 'Dane najemcy', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Przejdź do umowy' }).click();
  await expect(page.getByRole('heading', { name: 'Umowa wynajmu' })).toBeVisible();
  const extended = page.waitForResponse(
    (response) =>
      response.url().includes('rent/extend-rent/') &&
      response.request().method() === 'POST',
  );
  const paid = acceptAgreementAndPay(page);
  const response = await extended;
  expect(response.ok()).toBeTruthy();
  await paid;
};

export const clickNext = async (page: Page) => {
  const next = page
    .getByRole('button', { name: 'Dalej' })
    .or(page.getByRole('link', { name: 'Dalej' }));
  await expect(next).toBeEnabled();
  await next.click();
};
