import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { pieLegendPercent } from 'src/utils/chart-percent';

export type PieChartSegment = {
  label: string;
  value: number;
  color: string;
  formatValue?: (value: number) => string;};

type ChartDatum = {
  name: string;
  value: number;
  color: string;
};

type Props = {
  segments: PieChartSegment[];
  formatValue?: (value: number) => string;

  /** Denominator for legend percentages (e.g. total box count). Defaults to sum of segment values. */
  total?: number;
  showLegend?: boolean;
};

const ChartWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 160px;
  gap: 12px;
`;

const ChartArea = styled.div`
  flex: 1 1 auto;
  width: 100%;
  min-height: 140px;
`;

const Legend = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
`;

const LegendItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  line-height: 1.35;
`;

const Swatch = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  margin-top: 2px;
  border-radius: 2px;
  background-color: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  flex: 1 1 auto;
  min-width: 0;
`;

const LegendPercent = styled.span`
  flex-shrink: 0;
  font-weight: 600;
`;

const TooltipBox = styled.div`
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.background.white};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  font-size: 12px;
  line-height: 1.4;
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TooltipValue = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

const EMPTY_SLICE: ChartDatum[] = [{ name: 'empty', value: 1, color: '#e5e7eb' }];

export const PieChart = ({
  segments,
  total: totalOverride,
  showLegend = true,
  formatValue,
}: Props) => {
  const chartData = useMemo<ChartDatum[]>(
    () =>
      segments
        .filter((s) => s.value > 0)
        .map((s) => ({
          name: s.label,
          value: s.value,
          color: s.color,
        })),
    [segments],
  );

  const sum = chartData.reduce((acc, s) => acc + s.value, 0);
  const isEmpty = sum === 0;

  const legendTotal =
    totalOverride !== undefined && totalOverride > 0 ? totalOverride : sum;

  const getPercent = (value: number) =>
    pieLegendPercent(value, legendTotal);

  const pieData = isEmpty ? EMPTY_SLICE : chartData;

  const renderTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: ReadonlyArray<{ payload?: ChartDatum }>;
  }) => {
    if (!active || !payload?.length) return null;

    const datum = payload[0]?.payload;
    if (!datum || datum.name === 'empty') return null;

    return (
      <TooltipBox>
        <TooltipTitle>{datum.name}</TooltipTitle>
        <TooltipValue>
          {formatValue ? formatValue(datum.value) : datum.value} ({getPercent(datum.value)}%)
        </TooltipValue>
      </TooltipBox>
    );
  };

  return (
    <ChartWrap>
      <ChartArea>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip content={renderTooltip} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="80%"
              stroke="#ffffff"
              strokeWidth={1}
              isAnimationActive={false}
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      </ChartArea>
      {showLegend ? (
        <Legend aria-label="Chart legend">
          {segments.map((segment) => (
            <LegendItem key={segment.label}>
              <Swatch $color={segment.color} />
              <LegendLabel>{segment.label}</LegendLabel>
              <LegendPercent>{getPercent(segment.value)}%</LegendPercent>
            </LegendItem>
          ))}
        </Legend>
      ) : null}
    </ChartWrap>
  );
};
