import { Row } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { StatusStats } from '../StatusStats';
import { StockStatistics } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';

export type RentsStatsProps = {
  statistics: StockStatistics;
};

export const RentsStats = ({ statistics }: RentsStatsProps) => {
  const getStatsText = (total: number, count: number) => {
    const percent = total ? Math.round((count / total) * 100) : 0;
    return `${count}/${total} - ${percent}%`;
  };

  const { totalCount, byGroup, byStatus } = statistics;

  return (
    <>
      <Row label="stats.total" content={totalCount} />

      <Section>
        <Header variant="h3">{__('stats.byStatus')}</Header>
        <StatusStats stats={byStatus} totalCount={totalCount} />
      </Section>
      {Object.keys(byGroup).map((groupId) => (
        <Section key={groupId}>
          <Header variant="h3">
            {byGroup[groupId].name} ({byGroup[groupId].area}m²)
          </Header>
          <Row
            label="stats.totalInGroup"
            content={getStatsText(totalCount, byGroup[groupId].totalCount)}
          />
          <StatusStats
            stats={byGroup[groupId].byStatus}
            totalCount={byGroup[groupId].totalCount}
          />
        </Section>
      ))}
    </>
  );
};
