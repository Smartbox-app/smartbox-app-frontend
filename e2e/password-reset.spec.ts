import { expect, test } from '@playwright/test';
import { e2eReset } from './accounts';
import { hideCookieBar, login, readActivationToken, readApiResponse } from './helpers';

test('resets a password from the email link and signs in', async ({ page }) => {
  const nextPassword = 'E2eReset456';

  await hideCookieBar(page);
  await page.goto('/login');
  await page.getByRole('link', { name: 'Kliknij tutaj' }).click();
  await expect(page).toHaveURL(/\/restore-pass$/);
  await page.getByPlaceholder('example@gmail.com').fill(e2eReset.email);

  const petition = readApiResponse(
    page,
    (response) =>
      response.url().includes('user/restore-pwd-petition') &&
      response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Przywróć hasło' }).click();
  const petitionResponse = await petition;
  expect(petitionResponse.ok).toBeTruthy();
  expect(petitionResponse.body.result).toBe(1);
  expect(petitionResponse.body.error_code).toBeUndefined();
  await expect(page.getByText('Wysłano wiadomość')).toBeVisible();

  const { userId, updateToken } = readActivationToken(e2eReset.email);
  await page.goto(`/restore-pass/${userId}/${updateToken}`);
  await page.getByRole('textbox', { name: 'Nowe hasło', exact: true }).fill(nextPassword);
  await page
    .getByRole('textbox', { name: 'Powtórz nowe hasło', exact: true })
    .fill(nextPassword);

  const restored = readApiResponse(
    page,
    (response) =>
      response.url().includes('user/restore-pwd') &&
      !response.url().includes('restore-pwd-petition') &&
      response.request().method() === 'PATCH',
  );
  await page.getByRole('button', { name: 'Ustaw nowe hasło' }).click();
  const restoredResponse = await restored;
  expect(restoredResponse.ok).toBeTruthy();
  expect(restoredResponse.body.result).toBe(1);
  expect(restoredResponse.body.error_code).toBeUndefined();
  await expect(page.getByText('Ustawiono nowe hasło')).toBeVisible();

  await login(page, e2eReset.email, nextPassword, /\/user/);
  await expect(page.getByRole('button', { name: 'Nowy minimagazyn' })).toBeVisible();
});
