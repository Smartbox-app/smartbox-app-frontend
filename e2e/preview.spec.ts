import { expect, test } from '@playwright/test';
import {
  e2eAgreementPreviewText,
  e2ePreviewBoxIdentifier,
  e2eViewer,
} from './accounts';
import { login, openMyBox } from './helpers';

test('opens the rent agreement preview', async ({ page }) => {
  await login(page, e2eViewer.email, e2eViewer.password, /\/user/);
  await openMyBox(page, e2ePreviewBoxIdentifier);

  await page.getByRole('button', { name: 'Zobacz umowę najmu' }).click();
  await expect(page.getByRole('heading', { name: 'Umowa najmu' })).toBeVisible();
  await expect(page.getByText(e2eAgreementPreviewText)).toBeVisible();
});
