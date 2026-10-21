import { expect, test } from '@playwright/test';
import {
  hideCookieBar,
  login,
  readActivationToken,
  setAccountConfirmation,
  submitRegister,
} from './helpers';

test.afterEach(() => {
  setAccountConfirmation('email');
});

test('registers an account and activates it with the SMS code', async ({ page }) => {
  test.setTimeout(120_000);
  setAccountConfirmation('sms');

  const stamp = Date.now().toString().slice(-6);
  const email = `e2e-sms-${stamp}@example.com`;
  const password = 'E2eSms123';

  await hideCookieBar(page);
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Rejestracja' })).toBeVisible();

  await page.locator('#email').fill(email);
  await page.locator('#phone').fill(`+48511${stamp}`);
  await page.locator('#firstName').fill('Ola');
  await page.locator('#lastName').fill('Sms');
  await page.locator('#pwd').fill(password);
  await page.locator('#pwd2').fill(password);
  await page.getByText('Zapoznałem/am się z postanowieniami').click();
  await submitRegister(page);

  await expect(page).toHaveURL(/\/activate-account\?activationToken=/);
  await expect(
    page.getByRole('heading', { name: 'Aktywacja konta kodem SMS' }),
  ).toBeVisible();

  const { updateToken } = readActivationToken(email);
  await page.locator('input[name="code"]').fill(updateToken);
  const activate = page.getByRole('button', { name: 'Aktywuj konto' });
  await activate.click();
  const reachedLogin = page.waitForURL(/\/login/, { timeout: 4_000 });
  try {
    await reachedLogin;
  } catch {
    await activate.click();
  }
  await expect(page).toHaveURL(/\/login/, { timeout: 20_000 });
  await expect(page.getByText('Konto zostało aktywowane')).toBeVisible();

  await login(page, email, password, /\/user/);
  await expect(page.getByRole('button', { name: 'Nowy minimagazyn' })).toBeVisible();
});
