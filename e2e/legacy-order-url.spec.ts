import { expect, test } from '@playwright/test';
import { e2eRenter } from './accounts';
import { login } from './helpers';

test('legacy order address opens stock selection', async ({ page }) => {
  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);

  await page.goto('/user/order/step/stock?utm_source=legacy');
  await expect(page).toHaveURL(
    (url) =>
      url.pathname === '/user/order' &&
      url.searchParams.get('utm_source') === 'legacy',
  );
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać plac' }),
  ).toBeVisible();

  await page.goto('/user/order/step/duration/some-rent');
  await expect(page).toHaveURL((url) => url.pathname === '/user/order');
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać plac' }),
  ).toBeVisible();
});
