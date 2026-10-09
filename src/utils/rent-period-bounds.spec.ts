import { RentPaymentType } from 'smartbox-types';
import {
  clampedFixedTermEndDate,
  debtOnlyResolvedEnd,
  extensionMaxSelectableDate,
  extensionMinimumEnd,
  extensionMinSelectableDate,
  extensionStartFromFinish,
  initialFixedTermEndDate,
  isExtensionPeriodAcceptable,
  isNewRentPeriodAcceptable,
  minPeriodDebtResolvedEnd,
} from './rent-period-bounds';

const expectDay = (date: Date, day: number, hours: number) => {
  expect(date.getFullYear()).toBe(2026);
  expect(date.getMonth()).toBe(9);
  expect(date.getDate()).toBe(day);
  expect(date.getHours()).toBe(hours);
};

const start = new Date(2026, 9, 1, 12);

describe('fixed-term rent bounds', () => {
  it('sets the first end date to the minimum length, counting the start day', () => {
    expectDay(
      initialFixedTermEndDate(start, RentPaymentType.InAdvance, 7, null)!,
      7,
      23,
    );
  });

  it('uses the installment minimum and skips the update when that minimum is missing', () => {
    expectDay(
      initialFixedTermEndDate(start, RentPaymentType.Installments, 7, 30)!,
      30,
      23,
    );
    expect(
      initialFixedTermEndDate(start, RentPaymentType.Installments, 7, null),
    ).toBeNull();
  });

  it('pulls a short range up to the minimum and a long range down to the maximum', () => {
    expectDay(
      clampedFixedTermEndDate(
        start,
        new Date(2026, 9, 3),
        RentPaymentType.InAdvance,
        7,
        30,
        null,
      )!,
      7,
      23,
    );
    expectDay(
      clampedFixedTermEndDate(
        start,
        new Date(2026, 9, 20),
        RentPaymentType.InAdvance,
        7,
        10,
        null,
      )!,
      10,
      23,
    );
    expect(
      clampedFixedTermEndDate(
        start,
        new Date(2026, 9, 10),
        RentPaymentType.InAdvance,
        7,
        30,
        null,
      ),
    ).toBeNull();
  });

  it('uses the installment minimum when that payment type is selected', () => {
    expectDay(
      clampedFixedTermEndDate(
        start,
        new Date(2026, 9, 5),
        RentPaymentType.Installments,
        7,
        60,
        14,
      )!,
      14,
      23,
    );
  });
});

describe('period acceptance', () => {
  const bounds = {
    startDate: start,
    endDate: new Date(2026, 9, 10),
    minRentPeriod: 7,
    maxRentPeriod: 30,
    rentPaymentType: RentPaymentType.InAdvance,
    minRentDaysForInstallments: 14,
  };

  it('accepts an open-ended rent and rejects a rent that is missing dates', () => {
    expect(
      isNewRentPeriodAcceptable({ ...bounds, endDate: null, isOpenEnded: true }),
    ).toBe(true);
    expect(
      isNewRentPeriodAcceptable({
        ...bounds,
        startDate: null,
        isOpenEnded: false,
      }),
    ).toBe(false);
    expect(
      isNewRentPeriodAcceptable({
        ...bounds,
        isOpenEnded: false,
        maxRentPeriod: null,
      }),
    ).toBe(false);
  });

  it('rejects an installment range shorter than the installment minimum', () => {
    expect(
      isNewRentPeriodAcceptable({
        ...bounds,
        isOpenEnded: false,
        endDate: new Date(2026, 9, 5),
        rentPaymentType: RentPaymentType.Installments,
      }),
    ).toBe(false);
  });

  it('accepts a span inside the bounds and rejects one past the maximum', () => {
    expect(
      isNewRentPeriodAcceptable({ ...bounds, isOpenEnded: false }),
    ).toBe(true);
    expect(
      isNewRentPeriodAcceptable({
        ...bounds,
        isOpenEnded: false,
        endDate: new Date(2026, 9, 30),
      }),
    ).toBe(true);
    expect(
      isNewRentPeriodAcceptable({
        ...bounds,
        isOpenEnded: false,
        endDate: new Date(2026, 9, 31),
      }),
    ).toBe(false);
    expect(
      isExtensionPeriodAcceptable({
        hasRent: true,
        ...bounds,
        unpaidExtension: false,
        endDate: new Date(2026, 11, 1),
      }),
    ).toBe(false);
  });

  it('accepts an unpaid extension without checking the length', () => {
    expect(
      isExtensionPeriodAcceptable({
        hasRent: true,
        ...bounds,
        unpaidExtension: true,
        endDate: new Date(2026, 9, 2),
      }),
    ).toBe(true);
    expect(
      isExtensionPeriodAcceptable({
        hasRent: false,
        ...bounds,
        unpaidExtension: false,
      }),
    ).toBe(false);
  });
});

describe('extension dates', () => {
  const finish = new Date(2026, 9, 1, 12);
  const later = new Date(2026, 9, 20, 12);

  it('starts the extension on the day after the current finish', () => {
    expectDay(extensionStartFromFinish(finish), 2, 0);
  });

  it('resolves a debt-only extension to the end of the current day', () => {
    expectDay(debtOnlyResolvedEnd(later), 20, 23);
    expect(debtOnlyResolvedEnd(later).getMinutes()).toBe(59);
  });

  it('rounds a min-period debt up to a whole number of periods', () => {
    expectDay(minPeriodDebtResolvedEnd(new Date(2026, 9, 10, 12), finish, 7), 15, 23);
  });

  it('moves a past minimum end to the day after today', () => {
    expectDay(extensionMinimumEnd(finish, 7, new Date(2026, 9, 2, 12)), 8, 23);
    expectDay(extensionMinimumEnd(finish, 7, later), 21, 23);
  });

  it('limits the selectable range for a debt-only extension to today', () => {
    expectDay(
      extensionMinSelectableDate({
        finishAt: finish,
        addAmount: 7,
        now: later,
        debtOnly: true,
      }),
      20,
      23,
    );
    expectDay(
      extensionMaxSelectableDate({
        startDate: start,
        addAmount: 3,
        now: later,
        debtOnly: true,
      }),
      23,
      23,
    );
  });

  it('keeps a future minimum and clamps a past minimum to today', () => {
    expectDay(
      extensionMinSelectableDate({
        finishAt: finish,
        addAmount: 7,
        now: new Date(2026, 9, 2, 12),
        debtOnly: false,
      }),
      8,
      0,
    );
    expectDay(
      extensionMinSelectableDate({
        finishAt: finish,
        addAmount: 7,
        now: later,
        debtOnly: false,
      }),
      20,
      0,
    );
  });
});
