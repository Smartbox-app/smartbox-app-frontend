import {
  addDays,
  differenceInCalendarDays,
  differenceInDays,
  endOfDay,
  isBefore,
  startOfDay,
} from 'date-fns';
import { RentPaymentType } from 'smartbox-types';
import { dateOnlyNormalized } from './format-date';

export const initialFixedTermEndDate = (
  startDate: Date,
  rentPaymentType: RentPaymentType | null,
  minRentPeriod: number,
  minRentDaysForInstallments: number | null,
): Date | null => {
  if (rentPaymentType === RentPaymentType.Installments) {
    if (!minRentDaysForInstallments) return null;
    return endOfDay(addDays(startDate, minRentDaysForInstallments - 1));
  }

  return endOfDay(addDays(startDate, minRentPeriod - 1));
};

/** A replacement end date when the selected range is outside the configured bounds. */
export const clampedFixedTermEndDate = (
  startDate: Date,
  endDate: Date,
  rentPaymentType: RentPaymentType | null,
  minRentPeriod: number,
  maxRentPeriod: number | null,
  minRentDaysForInstallments: number | null,
): Date | null => {
  const difference = differenceInDays(endOfDay(endDate), startOfDay(startDate));

  if (
    rentPaymentType === RentPaymentType.Installments &&
    !!minRentDaysForInstallments
  ) {
    if (difference < minRentDaysForInstallments - 1) {
      return endOfDay(addDays(startDate, minRentDaysForInstallments - 1));
    }
  } else if (difference < minRentPeriod - 1) {
    return endOfDay(addDays(startDate, minRentPeriod - 1));
  }

  if (maxRentPeriod && difference > maxRentPeriod - 1) {
    return endOfDay(addDays(startDate, maxRentPeriod - 1));
  }

  return null;
};

export const isPeriodWithinConfiguredBounds = (
  difference: number,
  minRentPeriod: number,
  maxRentPeriod: number,
  rentPaymentType: RentPaymentType | null,
  minRentDaysForInstallments: number | null,
) => {
  if (
    rentPaymentType === RentPaymentType.Installments &&
    minRentDaysForInstallments &&
    difference < minRentDaysForInstallments - 1
  )
    return false;

  if (difference < minRentPeriod - 1) return false;
  if (difference > maxRentPeriod - 1) return false;
  return true;
};

export const isNewRentPeriodAcceptable = (input: {
  startDate: Date | null;
  endDate: Date | null;
  isOpenEnded: boolean;
  minRentPeriod: number | null;
  maxRentPeriod: number | null;
  rentPaymentType: RentPaymentType | null;
  minRentDaysForInstallments: number | null;
}) => {
  if (!input.startDate) return false;
  if (input.isOpenEnded) return true;
  if (!input.endDate || !input.minRentPeriod || input.maxRentPeriod === null)
    return false;

  return isPeriodWithinConfiguredBounds(
    differenceInCalendarDays(input.endDate, input.startDate),
    input.minRentPeriod,
    input.maxRentPeriod,
    input.rentPaymentType,
    input.minRentDaysForInstallments,
  );
};

export const isExtensionPeriodAcceptable = (input: {
  hasRent: boolean;
  startDate: Date | null;
  endDate: Date | null;
  minRentPeriod: number | null;
  maxRentPeriod: number | null;
  rentPaymentType: RentPaymentType | null;
  minRentDaysForInstallments: number | null;
  unpaidExtension: boolean;
}) => {
  if (
    !input.hasRent ||
    !input.endDate ||
    !input.startDate ||
    !input.minRentPeriod ||
    input.maxRentPeriod === null
  )
    return false;

  if (input.unpaidExtension) return true;

  return isPeriodWithinConfiguredBounds(
    differenceInCalendarDays(input.endDate, input.startDate),
    input.minRentPeriod,
    input.maxRentPeriod,
    input.rentPaymentType,
    input.minRentDaysForInstallments,
  );
};

const warsawMidnight = (value: Date | string | null) =>
  new Date(`${dateOnlyNormalized(value)} 00:00:00`);

export const extensionStartFromFinish = (finishAt: Date | string | null) =>
  addDays(warsawMidnight(finishAt), 1);

export const debtOnlyResolvedEnd = (now: Date) => {
  const normalizedEnd = dateOnlyNormalized(now);
  return new Date(`${normalizedEnd} 23:59:59`);
};

export const minPeriodDebtResolvedEnd = (
  now: Date,
  finishAt: Date | string | null,
  minRentPeriod: number,
) => {
  const parsedEnd = debtOnlyResolvedEnd(now);
  const difference = differenceInDays(
    parsedEnd,
    new Date(finishAt ?? parsedEnd),
  );
  const minPeriodsAmount = Math.ceil(difference / minRentPeriod);

  return endOfDay(
    addDays(warsawMidnight(finishAt), minPeriodsAmount * minRentPeriod),
  );
};

export const extensionMinimumEnd = (
  finishAt: Date | string | null,
  days: number,
  now: Date,
) => {
  const newEnd = addDays(warsawMidnight(finishAt), days);
  const newEndOrToday = isBefore(newEnd, now)
    ? startOfDay(addDays(now, 1))
    : newEnd;
  return endOfDay(newEndOrToday);
};

export const extensionMinSelectableDate = (input: {
  finishAt: Date | string | null;
  addAmount: number;
  now: Date;
  debtOnly: boolean;
}) => {
  if (input.debtOnly) return endOfDay(input.now);

  const minDate = addDays(warsawMidnight(input.finishAt), input.addAmount);
  if (isBefore(minDate, input.now)) return startOfDay(input.now);
  return minDate;
};

export const extensionMaxSelectableDate = (input: {
  startDate: Date;
  addAmount: number;
  now: Date;
  debtOnly: boolean;
}) => {
  if (input.debtOnly) return endOfDay(addDays(input.now, input.addAmount));
  return endOfDay(addDays(input.startDate, input.addAmount));
};
