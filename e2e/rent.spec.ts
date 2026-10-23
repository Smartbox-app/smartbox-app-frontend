import { expect, test } from '@playwright/test';
import { ApiErrorCode } from 'smartbox-types';
import { e2eBoxGroupName, e2eRenter, e2eStockName } from './accounts';
import {
  clickNext,
  confirmPaymentAsAdmin,
  expectApiOk,
  login,
  reachPaymentRedirect,
  rentStatus,
} from './helpers';

type CapturedRent = {
  url: string;
  contentType: string;
  body: Buffer;
};

let capturedRent: CapturedRent | undefined;

test.describe.serial('new rent', () => {
test('rents a seeded box after the payment is accepted', async ({ page }) => {
  test.setTimeout(120_000);
  page.on('request', (request) => {
    if (request.method() !== 'POST' || !request.url().includes('rent/new')) return;
    const body = request.postDataBuffer();
    const contentType = request.headers()['content-type'];
    if (!body || !contentType) return;
    capturedRent = { url: request.url(), contentType, body };
  });
  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();

  await expect(page.getByRole('heading', { name: 'Proszę wybrać obiekt' })).toBeVisible();
  await page.getByText(e2eStockName, { exact: true }).click();
  await clickNext(page);

  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar minimagazynu' }),
  ).toBeVisible();
  await page.getByText(e2eBoxGroupName, { exact: true }).click();
  await clickNext(page);

  await expect(page.getByRole('button', { name: 'Dalej' })).toBeEnabled({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Dalej' }).click();

  await expect(
    page.getByRole('heading', { name: 'Dane najemcy', exact: true }),
  ).toBeVisible();
  const rentCreated = page.waitForResponse(
    (response) =>
      response.url().includes('rent/new') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Przejdź do umowy' }).click();

  const created = await expectApiOk(await rentCreated);
  const rentId = (created.payload as { rentId?: string }).rentId;
  expect(rentId).toBeTruthy();
  await expect(page.getByRole('heading', { name: 'Umowa wynajmu' })).toBeVisible();
  await expect(page.getByText(/Zarezerwowano minimagazyn/)).toBeVisible();
  await reachPaymentRedirect(page);
  await confirmPaymentAsAdmin(page, e2eRenter.email);

  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
  const rented = page.locator(`a[href*="/single-rent/${rentId}"]`);
  await expect(async () => {
    await page.goto('/user');
    await expect(rented).toBeVisible();
  }).toPass();
  await rented.click();
  await expect(rentStatus(page)).toHaveText('Wynajęty');
});

test('rejects a repeated rent request when the group has no free box', async ({ page }) => {
  test.setTimeout(60_000);
  expect(capturedRent).toBeTruthy();
  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);

  let errorCode: unknown;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const response = await page.request.post(capturedRent!.url, {
      headers: { 'content-type': capturedRent!.contentType },
      data: capturedRent!.body,
    });
    const body = await response.json();
    if (body.error_code === ApiErrorCode.NoFreeBoxInThisSize) {
      errorCode = body.error_code;
      expect(body.result).not.toBe(1);
      break;
    }
    expect(body.result, JSON.stringify(body)).toBe(1);
  }
  expect(errorCode).toBe(ApiErrorCode.NoFreeBoxInThisSize);
});
});
