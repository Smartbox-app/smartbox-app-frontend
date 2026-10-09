import { expect, test } from '@playwright/test';
import { e2eBlocked } from './accounts';
import { login } from './helpers';

test('blocks a new rent while another rent is unpaid', async ({ page }) => {
  await login(page, e2eBlocked.email, e2eBlocked.password, /\/user/);
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();

  await expect(
    page.getByRole('heading', { name: 'Nie można rozpocząć nowego wynajmu' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Posiadasz nieopłacone przedłużenie istniejącego wynajmu. Opłać zaległość, zanim wynajmiesz kolejną skrytkę.',
    ),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/user\/main/);
});
