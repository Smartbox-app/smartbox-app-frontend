import React from 'react';
import { StatsByStatus } from 'smartbox-types';
import { ColorIndicator, Row } from 'src/components/Common';
import { StatsWithPieChart } from 'src/components/ui/StatsWithPieChart';
import { getStatsText, statsByStatusToPieSegments } from '../../utils/stats-chart';
import {
  STATUS_STATS_KEYS,
  StockStatusColors,
} from '../../utils/stock-status-colors';

export type StatusStatsProps = {
  stats: StatsByStatus;
  totalCount: number;
  statusColors: StockStatusColors;
};

export const StatusStats = ({
  totalCount,
  stats,
  statusColors,
}: StatusStatsProps) => {
  const segments = statsByStatusToPieSegments(stats, statusColors);

  return (
    <StatsWithPieChart segments={segments} legendTotal={totalCount}>
      
      {STATUS_STATS_KEYS.map((key) => (
        <Row
          key={key}
          label={`stats.${key}`}
          left={<ColorIndicator color={statusColors[key]} />}
          content={getStatsText(totalCount, stats[key])}
          columns="3fr 1fr"
        />
      ))}
    </StatsWithPieChart>
  );
};
