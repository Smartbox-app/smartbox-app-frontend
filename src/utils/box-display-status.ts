import { BoxDisplayStatus, BoxStatus, RentStatus } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';

const RENT_STATUS_LABEL_KEYS: Record<RentStatus, string> = {
  [RentStatus.reserved]: 'application.rentStatus.reserved',
  [RentStatus.rented]: 'application.rentStatus.rented',
  [RentStatus.noPaidExtension]: 'application.rentStatus.noPaidExtension',
  [RentStatus.noPaidExtensionWithWarning]:
    'application.rentStatus.noPaidExtensionWithWarning',
  [RentStatus.toCheck]: 'application.rentStatus.toCheck',
  [RentStatus.toExplain]: 'application.rentStatus.toExplain',
  [RentStatus.finished]: 'application.rentStatus.finished',
  [RentStatus.failure]: 'application.rentStatus.failure',
  [RentStatus.noPaidPeriod]: 'application.rentStatus.noPaidPeriod',
  [RentStatus.pendingFinish]: 'application.rentStatus.pendingFinish',
};

const BOX_STATUS_LABEL_KEYS: Record<BoxStatus, string> = {
  [BoxStatus.free]: 'application.rentStatus.free',
  [BoxStatus.outOfService]: 'application.rentStatus.outOfService',
};

export const translateBoxDisplayStatus = (
  status?: BoxDisplayStatus | null,
): string => {
  const value = status ?? BoxStatus.free;
  const key =
    BOX_STATUS_LABEL_KEYS[value as BoxStatus] ??
    RENT_STATUS_LABEL_KEYS[value as RentStatus];
  return key ? __(key) : String(value);
};

export const boxDisplayStatusSearchValues = (): Record<string, string> => ({
  [BoxStatus.free]: translateBoxDisplayStatus(BoxStatus.free),
  [BoxStatus.outOfService]: translateBoxDisplayStatus(BoxStatus.outOfService),
  [RentStatus.reserved]: translateBoxDisplayStatus(RentStatus.reserved),
  [RentStatus.rented]: translateBoxDisplayStatus(RentStatus.rented),
  [RentStatus.pendingFinish]: translateBoxDisplayStatus(
    RentStatus.pendingFinish,
  ),
  [RentStatus.noPaidExtension]: translateBoxDisplayStatus(
    RentStatus.noPaidExtension,
  ),
  [RentStatus.noPaidExtensionWithWarning]: translateBoxDisplayStatus(
    RentStatus.noPaidExtensionWithWarning,
  ),
  [RentStatus.noPaidPeriod]: translateBoxDisplayStatus(RentStatus.noPaidPeriod),
  [RentStatus.toCheck]: translateBoxDisplayStatus(RentStatus.toCheck),
  [RentStatus.toExplain]: translateBoxDisplayStatus(RentStatus.toExplain),
  [RentStatus.finished]: translateBoxDisplayStatus(RentStatus.finished),
  [RentStatus.failure]: translateBoxDisplayStatus(RentStatus.failure),
});

export const rentStatusSearchValues = (): Record<string, string> => ({
  [RentStatus.reserved]: translateBoxDisplayStatus(RentStatus.reserved),
  [RentStatus.rented]: translateBoxDisplayStatus(RentStatus.rented),
  [RentStatus.pendingFinish]: translateBoxDisplayStatus(
    RentStatus.pendingFinish,
  ),
  [RentStatus.noPaidExtension]: translateBoxDisplayStatus(
    RentStatus.noPaidExtension,
  ),
  [RentStatus.noPaidExtensionWithWarning]: translateBoxDisplayStatus(
    RentStatus.noPaidExtensionWithWarning,
  ),
  [RentStatus.noPaidPeriod]: translateBoxDisplayStatus(RentStatus.noPaidPeriod),
  [RentStatus.toCheck]: translateBoxDisplayStatus(RentStatus.toCheck),
  [RentStatus.toExplain]: translateBoxDisplayStatus(RentStatus.toExplain),
  [RentStatus.finished]: translateBoxDisplayStatus(RentStatus.finished),
  [RentStatus.failure]: translateBoxDisplayStatus(RentStatus.failure),
});
