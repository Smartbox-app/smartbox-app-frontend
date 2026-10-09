import { RentAgreementType, RentStatus } from 'smartbox-types';
import {
  hasDateValue,
  isRentAccessActive,
  isRentWithinFinishAt,
  latestPeriodFinishAt,
  resolveRentFinishAt,
} from './rent';

describe('rent dates', () => {
  const now = new Date(2026, 9, 8, 12);

  it('treats null and empty strings as missing dates', () => {
    expect(hasDateValue(null)).toBe(false);
    expect(hasDateValue('')).toBe(false);
    expect(hasDateValue(undefined)).toBe(false);
    expect(hasDateValue('2026-10-01')).toBe(true);
  });

  it('picks the latest period finish', () => {
    expect(latestPeriodFinishAt([])).toBeNull();
    expect(latestPeriodFinishAt(undefined)).toBeNull();
    expect(
      latestPeriodFinishAt([
        { finishAt: '2026-10-01' },
        { finishAt: '2026-11-01' },
        { finishAt: '2026-09-01' },
      ]),
    ).toBe('2026-11-01');
  });

  it('keeps a rent active through its finish date, and an open-ended rent with no date', () => {
    expect(
      isRentWithinFinishAt(
        { finishAt: null, agreementType: RentAgreementType.OpenEnded },
        now,
      ),
    ).toBe(true);
    expect(
      isRentWithinFinishAt(
        { finishAt: null, agreementType: RentAgreementType.FixedTerm },
        now,
      ),
    ).toBe(false);
    expect(
      isRentWithinFinishAt({ finishAt: new Date(2026, 9, 8, 18) }, now),
    ).toBe(true);
    expect(
      isRentWithinFinishAt({ finishAt: new Date(2026, 9, 7) }, now),
    ).toBe(false);
  });

  it('keeps access for a rent that is pending finish', () => {
    expect(
      isRentAccessActive(
        {
          status: RentStatus.pendingFinish,
          finishAt: new Date(2026, 9, 1),
        },
        now,
      ),
    ).toBe(true);
  });

  it('prefers the decision finish date', () => {
    expect(
      resolveRentFinishAt({
        decisionFinishAt: '2026-12-01',
        finishAt: '2026-10-01',
      }),
    ).toBe('2026-12-01');
    expect(resolveRentFinishAt({ finishAt: '2026-10-01' })).toBe('2026-10-01');
    expect(resolveRentFinishAt({})).toBeNull();
  });
});
