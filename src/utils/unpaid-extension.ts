import { MyRentList, RentStatus } from 'smartbox-types';

export const isUnpaidExtensionStatus = (status: RentStatus) =>
  status === RentStatus.noPaidExtension ||
  status === RentStatus.noPaidExtensionWithWarning;

export const isUnpaidPeriodStatus = (status: RentStatus) =>
  status === RentStatus.noPaidPeriod;

export const isUnpaidRentStatus = (status: RentStatus) =>
  isUnpaidExtensionStatus(status) || isUnpaidPeriodStatus(status);

export const findUnpaidRent = (rents: MyRentList[] = []) =>
  rents.find((rent) => isUnpaidRentStatus(rent.status));
