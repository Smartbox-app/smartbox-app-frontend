import { RentAgreementType, RentStatus } from 'smartbox-types';

export type RentFinishDates = {
  finishAt?: Date | string | null;
  decisionFinishAt?: Date | string | null;
};

export const hasDateValue = (
  value?: Date | string | null,
): value is Date | string => value != null && value !== '';

export const isOpenEndedAgreement = (
  agreementType?: RentAgreementType | null,
) => agreementType === RentAgreementType.OpenEnded;

export const latestPeriodFinishAt = (
  periods?: { finishAt: Date | string }[],
) => {
  if (!periods?.length) return null;
  return periods.reduce((latest, period) => {
    if (new Date(period.finishAt) > new Date(latest)) return period.finishAt;
    return latest;
  }, periods[0].finishAt);
};

export const isRentWithinFinishAt = (
  rent: {
    finishAt?: Date | string | null;
    agreementType?: RentAgreementType | null;
  },
  now: Date,
) => {
  if (!hasDateValue(rent.finishAt)) {
    return isOpenEndedAgreement(rent.agreementType);
  }
  return new Date(rent.finishAt) >= now;
};

export const isRentAccessActive = (
  rent: {
    status?: RentStatus | null;
    finishAt?: Date | string | null;
    agreementType?: RentAgreementType | null;
  },
  now: Date,
) => {
  if (rent.status === RentStatus.pendingFinish) return true;
  return isRentWithinFinishAt(rent, now);
};

export const resolveRentFinishAt = ({
  finishAt,
  decisionFinishAt,
}: RentFinishDates) => {
  if (hasDateValue(decisionFinishAt)) return decisionFinishAt;
  if (hasDateValue(finishAt)) return finishAt;
  return null;
};
