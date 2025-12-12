import { StockStatistics } from 'smartbox-types';
import { Row } from 'src/components/Common';
import { Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { formatPrice } from 'src/utils/format-price';

export type RentsStatsProps = {
  statistics: StockStatistics;
};

export const PaymentsStats = ({ statistics }: RentsStatsProps) => {
  const { incomeByMonth } = statistics;

  const sortedDates = Object.keys(incomeByMonth).sort(
    (a, b) => incomeByMonth[b].order - incomeByMonth[a].order
  );

  return (
    <>
      <Typography>{__('stats.paymentsStats')}</Typography>
      {sortedDates.map((date) => (
        <Row
          key={date}
          rawLabel={date}
          content={formatPrice(incomeByMonth[date].amount)}
        />
      ))}
    </>
  );
};
