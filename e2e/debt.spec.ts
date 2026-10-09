import { expect, test } from '@playwright/test';
import { e2eDebtBoxIdentifier, e2eDebtor } from './accounts';
import { login, openMyBox, submitExtensionPayment } from './helpers';

test('pays the debt on an unpaid extension', async ({ page }) => {
  await login(page, e2eDebtor.email, e2eDebtor.password, /\/user/);
  await openMyBox(page, e2eDebtBoxIdentifier);

  await expect(page.getByText('Na tym wynajmie znajduje się zaległość')).toBeVisible();
  await page.getByRole('button', { name: 'Opłać zaległość' }).click();
  await expect(page.getByText('Opłacasz zaległość dla Twojego wynajmu')).toBeVisible();

  await submitExtensionPayment(page);
});
