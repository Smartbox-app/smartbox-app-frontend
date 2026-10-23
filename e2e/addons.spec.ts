import { expect, Page, test } from '@playwright/test';
import {
  e2eBoxGroupName,
  e2eInsuranceBasicGross,
  e2eInsuranceBasicName,
  e2eInsuranceExtendedGross,
  e2eInsuranceExtendedName,
  e2eInsuranceName,
  e2ePadlockGross,
  e2ePadlockName,
  e2eRenter,
  e2eStockName,
} from './accounts';
import { clickNext, login } from './helpers';

const grossTotal = (page: Page) =>
  page
    .locator('section')
    .filter({
      has: page.getByRole('heading', { name: 'Cena brutto za wybrany okres' }),
    })
    .locator('strong')
    .first();

const readGrossTotal = async (page: Page) => {
  const text = await grossTotal(page).innerText();
  return Number(text.replace(/\s/g, '').replace('zł', '').replace(',', '.'));
};

const selectAddon = (page: Page, name: string) =>
  page.locator('li[role="button"]').filter({ hasText: name }).click();

test('adds and swaps addon prices while starting a rent', async ({ page }) => {
  await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();
  await expect(page.getByRole('heading', { name: 'Proszę wybrać obiekt' })).toBeVisible();
  await page.getByText(e2eStockName, { exact: true }).click();
  await clickNext(page);

  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar minimagazynu' }),
  ).toBeVisible();
  await page.getByText(e2eBoxGroupName, { exact: true }).click();
  await clickNext(page);

  await expect(
    page.getByRole('heading', { level: 2, name: e2eInsuranceName }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { level: 2, name: e2ePadlockName }),
  ).toBeVisible();
  await expect(grossTotal(page)).toBeVisible();

  const boxOnly = await readGrossTotal(page);
  expect(boxOnly).toBeGreaterThan(0);

  await selectAddon(page, e2eInsuranceBasicName);
  await expect.poll(() => readGrossTotal(page)).toBeCloseTo(boxOnly + e2eInsuranceBasicGross, 2);

  await selectAddon(page, e2eInsuranceExtendedName);
  await expect
    .poll(() => readGrossTotal(page))
    .toBeCloseTo(boxOnly + e2eInsuranceExtendedGross, 2);

  await selectAddon(page, e2ePadlockName);
  await expect
    .poll(() => readGrossTotal(page))
    .toBeCloseTo(boxOnly + e2eInsuranceExtendedGross + e2ePadlockGross, 2);

  await selectAddon(page, e2eInsuranceBasicName);
  await expect
    .poll(() => readGrossTotal(page))
    .toBeCloseTo(boxOnly + e2eInsuranceBasicGross + e2ePadlockGross, 2);

  await selectAddon(page, e2ePadlockName);
  await expect.poll(() => readGrossTotal(page)).toBeCloseTo(boxOnly + e2eInsuranceBasicGross, 2);
});
