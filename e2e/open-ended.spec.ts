import { expect, test } from '@playwright/test';
import {
  e2eBoxGroupName,
  e2eOpenEnded,
  e2eStockName,
} from './accounts';
import { acceptAgreementAndPay, clickNext, login } from './helpers';

test('creates an open-ended rent and redirects to the payment gateway', async ({
  page,
}) => {
  await login(page, e2eOpenEnded.email, e2eOpenEnded.password, /\/user/);
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();

  await expect(page.getByRole('heading', { name: 'Proszę wybrać plac' })).toBeVisible();
  await page.getByText(e2eStockName, { exact: true }).click();
  await clickNext(page);

  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar mini magazynu' }),
  ).toBeVisible();
  await page.getByText(e2eBoxGroupName, { exact: true }).click();
  await clickNext(page);

  await expect(page.getByRole('heading', { name: 'Rodzaj umowy' })).toBeVisible();
  await page.getByText('Umowa bezterminowa', { exact: true }).click();
  await expect(
    page.getByText('Umowa bezterminowa. Okres trwa 30 dni'),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cena brutto za okres' })).toBeVisible();
  await clickNext(page);

  await expect(
    page.getByRole('heading', { name: 'Dane najemcy', exact: true }),
  ).toBeVisible();
  const rentCreated = page.waitForResponse(
    (response) =>
      response.url().includes('rent/new') && response.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Przejdź do umowy' }).click();

  const response = await rentCreated;
  expect(response.ok()).toBeTruthy();
  await expect(page.getByRole('heading', { name: 'Umowa wynajmu' })).toBeVisible();
  await expect(page.getByText(/Zarezerwowano minimagazyn/)).toBeVisible();
  await acceptAgreementAndPay(page);
});
