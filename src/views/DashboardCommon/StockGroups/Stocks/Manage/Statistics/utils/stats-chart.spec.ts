import { StatsByStatus } from 'smartbox-types';
import {
  getStatsText,
  paymentMonthsToPieSegments,
  statsByStatusToPieSegments,
} from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Statistics/utils/stats-chart';

const stats = {
  free: 1,
  reserved: 0,
  rented: 2,
  pendingFinish: 0,
  toCheck: 0,
  toExplain: 0,
  noPaidExtension: 0,
  noPaidPeriod: 0,
  outOfService: 0,
} as StatsByStatus;

describe('stats chart', () => {
  it('formats a count, a total, and a rounded percent', () => {
    expect(getStatsText(0, 0)).toBe('0/0 - 0%');
    expect(getStatsText(4, 1)).toBe('1/4 - 25%');
    expect(getStatsText(3, 1)).toBe('1/3 - 33%');
  });

  it('maps each status onto a segment', () => {
    const colors = {
      free: '#fff',
      reserved: '#111',
      rented: '#222',
      pendingFinish: '#333',
      toCheck: '#444',
      toExplain: '#555',
      noPaidExtension: '#666',
      noPaidPeriod: '#777',
      outOfService: '#888',
    };

    const segments = statsByStatusToPieSegments(stats, colors);
    expect(segments).toHaveLength(9);
    expect(segments.find((segment) => segment.color === '#fff')?.value).toBe(1);
    expect(segments.find((segment) => segment.color === '#222')?.value).toBe(2);
  });

  it('wraps payment colors after the sixth month', () => {
    const segments = paymentMonthsToPieSegments(
      Array.from({ length: 7 }, (_, index) => ({
        label: `m${index}`,
        amount: index + 1,
      })),
    );

    expect(segments[0].color).toBe(segments[6].color);
    expect(segments[0].color).not.toBe(segments[1].color);
    expect(segments[6].value).toBe(7);
  });
});
