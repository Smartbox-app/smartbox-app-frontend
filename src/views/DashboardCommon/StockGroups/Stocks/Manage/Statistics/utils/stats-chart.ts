import { StatsByStatus } from 'smartbox-types';
import { PieChartSegment } from 'src/components/ui/PieChart';
import { __ } from 'src/helpers/i18n';

import {
  STATUS_STATS_KEYS,
  StockStatusColors,
} from './stock-status-colors';

export const getStatsText = (total: number, count: number) => {
  const percent = total ? Math.round((count / total) * 100) : 0;
  return `${count}/${total} - ${percent}%`;
};

export const statsByStatusToPieSegments = (
  stats: StatsByStatus,
  colors: StockStatusColors,
): PieChartSegment[] =>
  STATUS_STATS_KEYS.map((key) => ({
    label: __(`stats.${key}`),
    value: stats[key],
    color: colors[key],
  }));

/** Distinct hues for payment months (up to 6 slices). */
const PAYMENT_CHART_PALETTE = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#a855f7',
  '#ef4444',
  '#06b6d4',
];

export const paymentMonthsToPieSegments = (
  entries: { label: string; amount: number }[],
): PieChartSegment[] =>
  entries.map((entry, index) => ({
    label: entry.label,
    value: entry.amount,
    color: PAYMENT_CHART_PALETTE[index % PAYMENT_CHART_PALETTE.length],
  }));
