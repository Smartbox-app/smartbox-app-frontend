import { expect, test } from '@playwright/test';
import { e2eAdmin, e2eRenter } from './accounts';
import { login } from './helpers';

test('logs in a seeded renter', async ({ page }) => {
  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
  await expect(page.getByRole('button', { name: 'Nowy minimagazyn' })).toBeVisible();
});

test('logs in a seeded tenant administrator', async ({ page }) => {
  await login(page, e2eAdmin.email, e2eAdmin.password, /\/client/);
});
