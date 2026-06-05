import React from 'react';
import styled from 'styled-components';
import { PieChart, PieChartSegment } from '../PieChart';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing * 4}px;

  @media (min-width: 1366px) {
    flex-direction: row;
    align-items: center;
  }
`;

const ValuesColumn = styled.div`
  flex: 1;
`;

const ChartColumn = styled.div`
  flex: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-self: stretch;
`;

type Props = {
  segments: PieChartSegment[];
  children: React.ReactNode;
  /** Total used for legend % when legend is shown. */
  legendTotal?: number;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
};

export const StatsWithPieChart = ({
  segments,
  formatValue,
  children,
  legendTotal,
  showLegend = false,
}: Props) => (
  <Layout>
    <ValuesColumn>{children}</ValuesColumn>
    <ChartColumn>
      <PieChart
        segments={segments}
        total={legendTotal}
        showLegend={showLegend}
        formatValue={formatValue}
      />
    </ChartColumn>
  </Layout>
);
