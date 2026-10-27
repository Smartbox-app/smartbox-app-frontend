import {
  GATE_ACCESS_ALLOWED_RENT_STATUSES,
  RentAgreementType,
  RentStatus,
} from 'smartbox-types';

export type RentFinishDates = {
  finishAt?: Date | string | null;
  decisionFinishAt?: Date | string | null;
};

export type RentAccessCheck = {
  status?: RentStatus | null;
  startAt?: Date | string | null;
  finishAt?: Date | string | null;
  agreementType?: RentAgreementType | null;
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

/** Whether the access UI (gates / box / end) should be shown for this rent. */
export const canDisplayRentAccess = (
  rent: RentAccessCheck,
  now: Date = new Date(),
) => {
  if (
    !rent.status ||
    !GATE_ACCESS_ALLOWED_RENT_STATUSES.includes(rent.status)
  ) {
    return false;
  }

  return isRentAccessActive(rent, now);
};

export const hasRentStarted = (
  rent: Pick<RentAccessCheck, 'startAt'>,
  now: Date = new Date(),
) => !hasDateValue(rent.startAt) || new Date(rent.startAt) <= now;

/** Whether open-gate / open-box / end-rent actions may be used. */
export const canUseRentAccessActions = (
  rent: RentAccessCheck,
  now: Date = new Date(),
) => canDisplayRentAccess(rent, now) && hasRentStarted(rent, now);

export const resolveRentFinishAt = ({
  finishAt,
  decisionFinishAt,
}: RentFinishDates) => {
  if (hasDateValue(decisionFinishAt)) return decisionFinishAt;
  if (hasDateValue(finishAt)) return finishAt;
  return null;
};
