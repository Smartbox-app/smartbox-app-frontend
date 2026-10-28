import { expect, test } from '@playwright/test';
import { e2eExtensionBoxIdentifier, e2eExtender } from './accounts';
import {
  confirmPaymentAsAdmin,
  login,
  openMyBox,
  rentFinish,
  submitExtensionPayment,
} from './helpers';

test('extends an active paid rent', async ({ page }) => {
  test.setTimeout(120_000);
  await login(page, e2eExtender.email, e2eExtender.password, /\/user/);
  await openMyBox(page, e2eExtensionBoxIdentifier);
  const previousFinish = await rentFinish(page).innerText();
  await page.getByRole('button', { name: 'Przedłuż' }).click();

  await expect(page.getByText('Wybierz datę zakończenia wynajmu')).toBeVisible();
  await submitExtensionPayment(page);
  await confirmPaymentAsAdmin(page, e2eExtender.email);

  await login(page, e2eExtender.email, e2eExtender.password, /\/user/);
  await expect(async () => {
    await page.goto('/user');
    await openMyBox(page, e2eExtensionBoxIdentifier);
    await expect(rentFinish(page)).not.toHaveText(previousFinish);
    await expect(
      page
        .locator('section')
        .filter({ has: page.getByRole('heading', { name: 'Historia najmu' }) })
        .getByText(/^Cena - /)
        .first(),
    ).toBeVisible();
  }).toPass();
});
