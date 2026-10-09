import { expect, test } from '@playwright/test';
import {
  hideCookieBar,
  readActivationToken,
  readApiResponse,
  submitRegister,
} from './helpers';

test('sends the activation link again for an unactivated account', async ({ page }) => {
  const stamp = Date.now().toString().slice(-6);
  const email = `e2e-resend-${stamp}@example.com`;
  const password = 'E2eResend123';

  await hideCookieBar(page);
  await page.goto('/register');
  await page.locator('#email').fill(email);
  await page.locator('#phone').fill(`+48512${stamp}`);
  await page.locator('#firstName').fill('Iga');
  await page.locator('#lastName').fill('Link');
  await page.locator('#pwd').fill(password);
  await page.locator('#pwd2').fill(password);
  await page.getByText('Zapoznałem/am się z postanowieniami').click();
  await submitRegister(page);

  const previousToken = readActivationToken(email).updateToken;

  await page.goto('/resend-activation-link');
  await expect(
    page.getByRole('heading', { name: 'Wyślij ponownie link do aktywacji konta' }),
  ).toBeVisible();
  await page.getByPlaceholder('example@gmail.com').fill(email);

  const resent = readApiResponse(
    page,
    (response) =>
      response.url().includes('user/resend-activation-email') &&
      response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Wyślij' }).click();
  const response = await resent;

  expect(response.ok).toBeTruthy();
  expect(response.body.result).toBe(1);
  expect(response.body.error_code).toBeUndefined();
  expect(response.body.payload).toEqual({ activationToken: null });
  await expect(
    page.getByText(
      'Link do aktywacji konta zostanie wysłany na podany adres email jeśli taki użytkownik istnieje.',
    ),
  ).toBeVisible();

  const nextToken = readActivationToken(email).updateToken;
  expect(nextToken).not.toBe(previousToken);
});
