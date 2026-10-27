import { StockStatistics } from 'smartbox-types';
import { Header, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useI18n } from 'src/i18n';
import { StatusStats } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Statistics/components/StatusStats';
import { getStatsText } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Statistics/utils/stats-chart';
import { StockStatusColors } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Statistics/utils/stock-status-colors';

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
