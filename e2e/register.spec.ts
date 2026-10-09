import { expect, test } from '@playwright/test';
import { hideCookieBar, login, readActivationToken, submitRegister } from './helpers';

test('creates an account and activates it from the stored email token', async ({ page }) => {
  const stamp = Date.now().toString().slice(-6);
  const email = `e2e-reg-${stamp}@example.com`;
  const password = 'E2eReg123';

  await hideCookieBar(page);
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Rejestracja' })).toBeVisible();

  await page.locator('#email').fill(email);
  await page.locator('#phone').fill(`+48500${stamp}`);
  await page.locator('#firstName').fill('Ewa');
  await page.locator('#lastName').fill('Testowa');
  await page.locator('#pwd').fill(password);
  await page.locator('#pwd2').fill(password);
  await page.getByText('Zapoznałem/am się z postanowieniami').click();
  await submitRegister(page);
  await expect(
    page.getByText('Aby dokończyć rejestrację proszę zweryfikować maila.'),
  ).toBeVisible();

  const { userId, updateToken } = readActivationToken(email);
  await page.goto(`/email-confirmation/${userId}/${updateToken}`);
  await expect(page).toHaveURL(/\/login/, { timeout: 20_000 });

  await login(page, email, password, /\/user/);
  await expect(page.getByRole('button', { name: 'Nowy minimagazyn' })).toBeVisible();
});
