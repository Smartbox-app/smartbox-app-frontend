import { expect, test } from '@playwright/test';
import { e2eExtensionBoxIdentifier, e2eExtender } from './accounts';
import { login, openMyBox, submitExtensionPayment } from './helpers';

test('extends an active paid rent', async ({ page }) => {
  await login(page, e2eExtender.email, e2eExtender.password, /\/user/);
  await openMyBox(page, e2eExtensionBoxIdentifier);
  await page.getByRole('button', { name: 'Przedłuż' }).click();

  await expect(page.getByText('Wybierz datę zakończenia wynajmu')).toBeVisible();
  await submitExtensionPayment(page);
});
