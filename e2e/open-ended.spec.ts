import { expect, test } from '@playwright/test';
import { e2eBoxGroupName, e2eOpenEnded, e2eStockName } from './accounts';
import {
  clickNext,
  confirmPaymentAsAdmin,
  expectApiOk,
  login,
  reachPaymentRedirect,
  rentStatus,
} from './helpers';

test('creates an open-ended rent after the payment is accepted', async ({ page }) => {
  test.setTimeout(120_000);
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
  await expect(page.getByText('Umowa bezterminowa. Okres trwa 30 dni')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cena brutto za okres' })).toBeVisible();
  await clickNext(page);

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
  await confirmPaymentAsAdmin(page, e2eOpenEnded.email);

  await login(page, e2eOpenEnded.email, e2eOpenEnded.password, /\/user/);
  const rented = page.locator(`a[href*="/single-rent/${rentId}"]`);
  await expect(async () => {
    await page.goto('/user');
    await expect(rented).toBeVisible();
  }).toPass();
  await rented.click();
  await expect(rentStatus(page)).toHaveText('Wynajęty');
  await expect(
    page.locator('.row').filter({ hasText: 'Rodzaj umowy:' }).locator('.row-content'),
  ).toHaveText('Umowa bezterminowa');
});
