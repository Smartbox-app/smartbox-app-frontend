import { StockStatistics } from 'smartbox-types';
import { ColorIndicator, Row } from 'src/components/Common';
import { Section, Typography } from 'src/components/ui';
import { StatsWithPieChart } from 'src/components/ui/StatsWithPieChart';
import { __ } from 'src/helpers/i18n';
import { formatPrice } from 'src/utils/format-price';

import { paymentMonthsToPieSegments } from '../../utils/stats-chart';

export type PaymentsStatsProps = {
  statistics: StockStatistics;
};

export const PaymentsStats = ({ statistics }: PaymentsStatsProps) => {
  const { incomeByMonth } = statistics;

  const sortedEntries = Object.keys(incomeByMonth)
    .sort((a, b) => incomeByMonth[a].order - incomeByMonth[b].order)
    .map((date) => ({
      label: date,
      amount: incomeByMonth[date].amount,
    }));

  const segments = paymentMonthsToPieSegments(sortedEntries);
  const paymentsTotal = sortedEntries.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <Typography>{__('stats.paymentsStats')}</Typography>
      <Section variant="bordered">
        <StatsWithPieChart segments={segments} legendTotal={paymentsTotal} formatValue={formatPrice}>
          {sortedEntries.map(({ label, amount }, index) => (
            <Row
              key={label}
              rawLabel={label}
              left={<ColorIndicator color={segments[index].color} />}
              content={formatPrice(amount)}
              columns="3fr 1fr"
            />
          ))}
        </StatsWithPieChart>
      </Section>
    </>
  );
};
