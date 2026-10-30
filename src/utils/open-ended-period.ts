import { addDays, endOfDay, startOfDay } from 'date-fns';

export const openEndedFirstPeriodFinish = (
  startAt: Date,
  periodDays: number,
) => endOfDay(addDays(startOfDay(startAt), periodDays - 1));

export const openEndedNextInvoiceDate = (
  periodFinish: Date,
  invoiceDaysBefore: number,
) =>
  startOfDay(
    addDays(startOfDay(addDays(periodFinish, 1)), -invoiceDaysBefore),
  );
