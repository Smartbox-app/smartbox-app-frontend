import { expect, test } from '@playwright/test';
import {
  e2eDebtLongBoxIdentifier,
  e2eDebtLongExtendBoxIdentifier,
  e2eDebtShortBoxIdentifier,
  e2eDebtShortExtendBoxIdentifier,
  e2eDebtor,
} from './accounts';
import {
  confirmPaymentAsAdmin,
  dayFromToday,
  expectGrossTotal,
  expectRentDayCount,
  formatDayPl,
  login,
  openMyBox,
  rentFinish,
  rentStatus,
  selectInlineCalendarDay,
  submitExtensionPayment,
} from './helpers';

const minRentPeriod = 7;
const extendedDays = 30;

/** Short debt: finish today-3 → overdue ~3 → max(3, 7) = 7 */
const shortFinishOffset = -3;
const shortStartOffset = shortFinishOffset + 1;
const shortMinDays = minRentPeriod;

/** Long debt: finish today-10 → overdue ~10 → max(10, 7) = 10 */
const longFinishOffset = -10;
const longStartOffset = longFinishOffset + 1;
const longMinDays = -longStartOffset + 1;

const openDebtPayment = async (
  page: import('@playwright/test').Page,
  boxIdentifier: string,
) => {
  await login(page, e2eDebtor.email, e2eDebtor.password, /\/user/);
  await openMyBox(page, boxIdentifier);

  await expect(page.getByText('Na tym wynajmie znajduje się zaległość')).toBeVisible();
  await page.getByRole('button', { name: 'Opłać zaległość' }).click();
  await expect(page.getByText('Opłacasz zaległość dla Twojego wynajmu')).toBeVisible();
  await expect(page.getByText('Wybierz datę zakończenia wynajmu')).toBeVisible();
};

const expectDebtCleared = async (
  page: import('@playwright/test').Page,
  boxIdentifier: string,
  finish?: Date,
) => {
  await login(page, e2eDebtor.email, e2eDebtor.password, /\/user/);
  await expect(async () => {
    await page.goto('/user');
    await openMyBox(page, boxIdentifier);
    await expect(page.getByText('Na tym wynajmie znajduje się zaległość')).toHaveCount(0);
    await expect(rentStatus(page)).toHaveText('Wynajęty');
    if (finish) {
      await expect(rentFinish(page)).toHaveText(formatDayPl(finish));
    }
  }).toPass();
};

test('short debt defaults to min rent period', async ({ page }) => {
  test.setTimeout(120_000);
  await openDebtPayment(page, e2eDebtShortBoxIdentifier);

  await expectRentDayCount(page, shortMinDays);
  await expectGrossTotal(page, shortMinDays);

  await submitExtensionPayment(page);
  await confirmPaymentAsAdmin(page, e2eDebtor.email);
  await expectDebtCleared(page, e2eDebtShortBoxIdentifier);
});

test('short debt can be extended beyond the minimum', async ({ page }) => {
  test.setTimeout(120_000);
  await openDebtPayment(page, e2eDebtShortExtendBoxIdentifier);

  await expectRentDayCount(page, shortMinDays);
  await expectGrossTotal(page, shortMinDays);

  const end = dayFromToday(shortStartOffset + extendedDays - 1);
  await selectInlineCalendarDay(page, end, {
    calendarIndex: 0,
    priceUrlIncludes: 'box-group-new/price-for-rent/',
  });
  await expectRentDayCount(page, extendedDays);
  await expectGrossTotal(page, extendedDays);

  await submitExtensionPayment(page);
  await confirmPaymentAsAdmin(page, e2eDebtor.email);
  await expectDebtCleared(page, e2eDebtShortExtendBoxIdentifier, end);
});

test('long debt defaults to full overdue days', async ({ page }) => {
  test.setTimeout(120_000);
  await openDebtPayment(page, e2eDebtLongBoxIdentifier);

  await expectRentDayCount(page, longMinDays);
  await expectGrossTotal(page, longMinDays);

  await submitExtensionPayment(page);
  await confirmPaymentAsAdmin(page, e2eDebtor.email);
  await expectDebtCleared(page, e2eDebtLongBoxIdentifier);
});

test('long debt can be extended beyond the overdue period', async ({ page }) => {
  test.setTimeout(120_000);
  await openDebtPayment(page, e2eDebtLongExtendBoxIdentifier);

  await expectRentDayCount(page, longMinDays);
  await expectGrossTotal(page, longMinDays);

  const end = dayFromToday(longStartOffset + extendedDays - 1);
  await selectInlineCalendarDay(page, end, {
    calendarIndex: 0,
    priceUrlIncludes: 'box-group-new/price-for-rent/',
  });
  await expectRentDayCount(page, extendedDays);
  await expectGrossTotal(page, extendedDays);

  await submitExtensionPayment(page);
  await confirmPaymentAsAdmin(page, e2eDebtor.email);
  await expectDebtCleared(page, e2eDebtLongExtendBoxIdentifier, end);
});
