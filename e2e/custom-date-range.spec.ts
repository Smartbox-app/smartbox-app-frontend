import { expect, Page, test } from '@playwright/test';
import {
  e2eBoxGroupName,
  e2eExtensionBoxIdentifier,
  e2eExtender,
  e2eRenter,
  e2eStockName,
} from './accounts';
import {
  clickNext,
  confirmPaymentAsAdmin,
  dayFromToday,
  expectApiOk,
  expectGrossTotal,
  expectRentDayCount,
  formatDayPl,
  login,
  openMyBox,
  reachPaymentRedirect,
  rentFinish,
  rentStart,
  rentStatus,
  selectInlineCalendarDay,
  submitExtensionPayment,
} from './helpers';

const minDays = 7;
/** Seeded extension finish is today+20; extension start is the next day. */
const extensionFinishOffset = 20;

type RentPeriodCase = {
  name: string;
  days: number;
  startOffset: number;
};

type ExtendPeriodCase = {
  name: string;
  days: number;
};

const rentPeriodCases: RentPeriodCase[] = [
  { name: 'short min period', days: minDays, startOffset: 0 },
  { name: 'short with delayed start', days: minDays, startOffset: 3 },
  { name: 'medium period', days: 14, startOffset: 0 },
  { name: 'medium with delayed start', days: 14, startOffset: 2 },
  { name: 'long month', days: 30, startOffset: 0 },
  { name: 'long month with delayed start', days: 30, startOffset: 2 },
  { name: 'long quarter', days: 90, startOffset: 0 },
];

const extendPeriodCases: ExtendPeriodCase[] = [
  { name: 'short min period', days: minDays },
  { name: 'medium period', days: 14 },
  { name: 'long month', days: 30 },
  { name: 'long quarter', days: 90 },
];

const reachNewRentDuration = async (page: Page) => {
  await page.goto('/user');
  await page.getByRole('button', { name: 'Nowy minimagazyn' }).click();
  await expect(page.getByRole('heading', { name: 'Proszę wybrać plac' })).toBeVisible();
  await page.getByText(e2eStockName, { exact: true }).click();
  await clickNext(page);
  await expect(
    page.getByRole('heading', { name: 'Proszę wybrać rozmiar minimagazynu' }),
  ).toBeVisible();
  await page.getByText(e2eBoxGroupName, { exact: true }).click();
  await clickNext(page);
  await expect(page.getByText('Wybierz datę rozpoczęcia wynajmu')).toBeVisible();
};

const applyRentPeriod = async (page: Page, startOffset: number, days: number) => {
  const start = dayFromToday(startOffset);
  const end = dayFromToday(startOffset + days - 1);
  if (startOffset > 0) {
    await selectInlineCalendarDay(page, start, {
      calendarIndex: 0,
      priceUrlIncludes: 'box-group-new/price/',
    });
  }
  // Start change already clamps end to the min period — re-clicking that day
  // does not refetch price, so only pick end when the period is longer.
  if (days !== minDays) {
    await selectInlineCalendarDay(page, end, {
      calendarIndex: 1,
      priceUrlIncludes: 'box-group-new/price/',
    });
  }
  await expectRentDayCount(page, days);
  await expectGrossTotal(page, days);
  return { start, end };
};

const reachExtensionDuration = async (page: Page) => {
  await page.goto('/user');
  await openMyBox(page, e2eExtensionBoxIdentifier);
  await page.getByRole('button', { name: 'Przedłuż' }).click();
  await expect(page.getByText('Wybierz datę zakończenia wynajmu')).toBeVisible();
};

const applyExtensionPeriod = async (page: Page, days: number) => {
  if (days !== minDays) {
    const end = dayFromToday(extensionFinishOffset + days);
    await selectInlineCalendarDay(page, end, {
      calendarIndex: 0,
      priceUrlIncludes: 'box-group-new/price-for-rent/',
    });
  }
  await expectRentDayCount(page, days);
  await expectGrossTotal(page, days);
  return dayFromToday(extensionFinishOffset + days);
};

test.describe('rent period pricing matrix', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
  });

  for (const period of rentPeriodCases) {
    test(`prices a ${period.name} (${period.days}d, start+${period.startOffset})`, async ({
      page,
    }) => {
      await reachNewRentDuration(page);
      await expectRentDayCount(page, minDays);
      await expectGrossTotal(page, minDays);
      await applyRentPeriod(page, period.startOffset, period.days);
    });
  }
});

test.describe('extend period pricing matrix', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, e2eExtender.email, e2eExtender.password, /\/user/);
  });

  for (const period of extendPeriodCases) {
    test(`prices a ${period.name} extension (${period.days}d)`, async ({ page }) => {
      await reachExtensionDuration(page);
      await expectRentDayCount(page, minDays);
      await expectGrossTotal(page, minDays);
      await applyExtensionPeriod(page, period.days);
    });
  }
});

test.describe.serial('custom date range checkout', () => {
  test('rents a long period after changing start and end dates', async ({ page }) => {
    test.setTimeout(120_000);
    const days = 30;
    const startOffset = 2;
    await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
    await reachNewRentDuration(page);
    const { start, end } = await applyRentPeriod(page, startOffset, days);

    await clickNext(page);
    await expect(
      page.getByRole('heading', { name: 'Dane najemcy', exact: true }),
    ).toBeVisible();
    const rentCreated = page.waitForResponse(
      (response) =>
        response.url().includes('rent/new') && response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: 'Przejdź do umowy' }).click();

    const created = await expectApiOk(await rentCreated);
    const rentId = (created.payload as { rentId?: string }).rentId;
    expect(rentId).toBeTruthy();
    await expect(page.getByText(/Zarezerwowano minimagazyn/)).toBeVisible();
    await reachPaymentRedirect(page);
    await confirmPaymentAsAdmin(page, e2eRenter.email);

    await login(page, e2eRenter.email, e2eRenter.password, /\/user/);
    const rented = page.locator(`a[href*="/single-rent/${rentId}"]`);
    await expect(async () => {
      await page.goto('/user');
      await expect(rented).toBeVisible();
    }).toPass();
    await rented.click();
    await expect(rentStatus(page)).toHaveText('Wynajęty');
    await expect(rentStart(page)).toHaveText(formatDayPl(start));
    await expect(rentFinish(page)).toHaveText(formatDayPl(end));
  });

  test('extends with a long custom period and matching price', async ({ page }) => {
    test.setTimeout(120_000);
    const days = 30;
    await login(page, e2eExtender.email, e2eExtender.password, /\/user/);
    await openMyBox(page, e2eExtensionBoxIdentifier);
    const previousFinish = await rentFinish(page).innerText();
    await page.getByRole('button', { name: 'Przedłuż' }).click();
    await expect(page.getByText('Wybierz datę zakończenia wynajmu')).toBeVisible();
    await expectRentDayCount(page, minDays);
    await expectGrossTotal(page, minDays);
    const end = await applyExtensionPeriod(page, days);

    await submitExtensionPayment(page);
    await confirmPaymentAsAdmin(page, e2eExtender.email);

    await login(page, e2eExtender.email, e2eExtender.password, /\/user/);
    await expect(async () => {
      await page.goto('/user');
      await openMyBox(page, e2eExtensionBoxIdentifier);
      await expect(rentFinish(page)).toHaveText(formatDayPl(end));
      await expect(rentFinish(page)).not.toHaveText(previousFinish);
    }).toPass();
  });
});
