import { RentStatus } from '../rent/rent-entity';

export const GATE_ACCESS_ALLOWED_RENT_STATUSES: RentStatus[] = [
  RentStatus.rented,
  RentStatus.pendingFinish,
  RentStatus.awaitingFinish,
];

export const GATE_ACCESS_BLOCKING_RENT_STATUSES: RentStatus[] = [
  RentStatus.noPaidExtension,
  RentStatus.noPaidExtensionWithWarning,
  RentStatus.noPaidPeriod,
  RentStatus.endedUnpaid,
];
