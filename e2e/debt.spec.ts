import { expect, test } from '@playwright/test';
import { e2eDebtBoxIdentifier, e2eDebtor } from './accounts';
import {
  confirmPaymentAsAdmin,
  login,
  openMyBox,
  rentStatus,
  submitExtensionPayment,
} from './helpers';

test('pays the debt on an unpaid extension', async ({ page }) => {
  test.setTimeout(120_000);
  await login(page, e2eDebtor.email, e2eDebtor.password, /\/user/);
  await openMyBox(page, e2eDebtBoxIdentifier);

  await expect(page.getByText('Na tym wynajmie znajduje się zaległość')).toBeVisible();
  await page.getByRole('button', { name: 'Opłać zaległość' }).click();
  await expect(page.getByText('Opłacasz zaległość dla Twojego wynajmu')).toBeVisible();

  await submitExtensionPayment(page);
  await confirmPaymentAsAdmin(page, e2eDebtor.email);

  await login(page, e2eDebtor.email, e2eDebtor.password, /\/user/);
  await expect(async () => {
    await page.goto('/user');
    await openMyBox(page, e2eDebtBoxIdentifier);
    await expect(page.getByText('Na tym wynajmie znajduje się zaległość')).toHaveCount(0);
    await expect(rentStatus(page)).toHaveText('Wynajęty');
  }).toPass();
});
