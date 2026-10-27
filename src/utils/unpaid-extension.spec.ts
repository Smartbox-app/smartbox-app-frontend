import { MyRentList, RentStatus } from 'smartbox-types';
import {
  findUnpaidRent,
  isEndedUnpaidStatus,
  isUnpaidExtensionStatus,
  isUnpaidPeriodStatus,
  isUnpaidRentStatus,
} from 'src/utils/unpaid-extension';

describe('unpaid rent status', () => {
  it('classifies extension, period, and ended-unpaid statuses', () => {
    expect(isUnpaidExtensionStatus(RentStatus.noPaidExtension)).toBe(true);
    expect(isUnpaidExtensionStatus(RentStatus.noPaidExtensionWithWarning)).toBe(
      true,
    );
    expect(isUnpaidPeriodStatus(RentStatus.noPaidPeriod)).toBe(true);
    expect(isEndedUnpaidStatus(RentStatus.endedUnpaid)).toBe(true);
    expect(isUnpaidRentStatus(RentStatus.rented)).toBe(false);
  });

  it('returns the first unpaid rent', () => {
    const rents = [
      { status: RentStatus.rented },
      { status: RentStatus.noPaidPeriod },
    ] as MyRentList[];

    expect(findUnpaidRent(rents)?.status).toBe(RentStatus.noPaidPeriod);
    expect(findUnpaidRent([])).toBeUndefined();
    expect(findUnpaidRent()).toBeUndefined();
  });
});
