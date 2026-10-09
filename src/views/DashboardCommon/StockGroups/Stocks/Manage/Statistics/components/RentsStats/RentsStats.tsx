import { Header, Section, Typography } from 'src/components/ui';
import { StatusStats } from '../StatusStats';
import { StockStatistics } from 'smartbox-types';
import { __ } from 'src/helpers/i18n';
import { getStatsText } from '../../utils/stats-chart';
import { StockStatusColors } from '../../utils/stock-status-colors';
import { useI18n } from 'src/i18n';

export type RentsStatsProps = {
  statistics: StockStatistics;
  statusColors: StockStatusColors;
};

export const RentsStats = ({ statistics, statusColors }: RentsStatsProps) => {
  const { totalCount, byGroup, byStatus } = statistics;
  const { t } = useI18n();
  return (
    <>
      <Typography>
        {t('stats.total')}: <strong>{totalCount}</strong>
      </Typography>
      <Section variant="bordered">
        <Header variant="h3">{__('stats.byStatus')}</Header>
        <StatusStats
          stats={byStatus}
          totalCount={totalCount}
          statusColors={statusColors}
        />
      </Section>
      {Object.keys(byGroup).map((groupId) => (
        <Section variant="bordered" key={groupId}>
          <Header variant="h3">
            {byGroup[groupId].name} ({byGroup[groupId].area}m²)
          </Header>
          <Typography>
            {t('stats.totalInGroup')}:{' '}
            <strong>
              {getStatsText(totalCount, byGroup[groupId].totalCount)}
            </strong>
          </Typography>
          <StatusStats
            stats={byGroup[groupId].byStatus}
            totalCount={byGroup[groupId].totalCount}
            statusColors={statusColors}
          />
        </Section>
      ))}
    </>
  );
};
