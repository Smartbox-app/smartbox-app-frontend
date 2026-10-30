import { isAfter, isBefore } from 'date-fns';

import { PeriodEntity, RentDescription } from 'smartbox-types';

export type ResolvedRentAgreement = {
  documentId?: string | null;
  agreement?: string;
};

const isPeriodWithinDescriptionLine = (
  period: PeriodEntity,
  line: RentDescription,
) => {
  const lineStart = new Date(line.startAt);
  const periodStart = new Date(period.startAt);
  const periodFinish = new Date(period.finishAt);

  if (isBefore(periodStart, lineStart)) return false;
  if (!line.finishAt) return true;
  return !isAfter(periodFinish, new Date(line.finishAt));
};

export const resolveRentAgreementForDescriptionLine = (
  line: RentDescription,
  periods: PeriodEntity[] = [],
): ResolvedRentAgreement => {
  if (line.documentId) {
    return {
      documentId: line.documentId,
      agreement: line.agreement,
    };
  }

  const periodWithDocument = periods.find(
    (period) =>
      period.agreementDocumentId &&
      isPeriodWithinDescriptionLine(period, line),
  );

  return {
    documentId: periodWithDocument?.agreementDocumentId ?? null,
    agreement: line.agreement,
  };
};

export const hasViewableAgreementPeriod = (
  line: RentDescription,
  periods: PeriodEntity[] = [],
) => {
  const resolved = resolveRentAgreementForDescriptionLine(line, periods);
  return Boolean(resolved.documentId || resolved.agreement);
};
