import {
  dateOnly,
  dateOnlyLocalTime,
  dateOnlyNormalized,
  fullDate,
} from 'src/utils/format-date';

describe('format-date', () => {
  it('renders a missing date as a dash', () => {
    expect(dateOnly(null)).toBe('---');
    expect(dateOnlyNormalized(null)).toBe('---');
    expect(fullDate(null as unknown as Date)).toBe('---');
  });

  it('formats instants in the Warsaw timezone', () => {
    const instant = '2026-01-15T23:30:00.000Z';

    expect(dateOnly(instant)).toBe('16.01.2026');
    expect(dateOnly(instant, 5)).toBe('16.01');
    expect(dateOnlyNormalized(instant)).toBe('2026-01-16');
    expect(fullDate(instant)).toBe('16.01.2026 00:30');
    expect(fullDate(Date.parse(instant))).toBe('16.01.2026 00:30');
    expect(fullDate(String(Date.parse(instant)))).toBe('16.01.2026 00:30');
  });

  it('formats a local calendar date and replaces an invalid value', () => {
    expect(dateOnlyLocalTime(new Date(2026, 0, 15))).toBe('15.01.2026');
    expect(fullDate('not-a-date')).toBe('---');
  });
});
