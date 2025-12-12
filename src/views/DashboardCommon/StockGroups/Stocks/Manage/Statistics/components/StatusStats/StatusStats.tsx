import { StatsByStatus } from 'smartbox-types';
import { Row } from 'src/components/Common';

export type StatusStatsProps = {
  stats: StatsByStatus;
  totalCount: number;
};

export const StatusStats = ({ totalCount, stats }: StatusStatsProps) => {
  const {
    free,
    toExplain,
    toCheck,
    rented,
    reserved,
    outOfService,
    noPaidExtension,
    noPaidPeriod,
  } = stats;

  const getStatsText = (total: number, count: number) => {
    const percent = total ? Math.round((count / total) * 100) : 0;
    return `${count}/${total} - ${percent}%`;
  };

  return (
    <div>
      <Row label="stats.free" content={getStatsText(totalCount, free)} />
      <Row label="stats.rented" content={getStatsText(totalCount, rented)} />
      <Row
        label="stats.reserved"
        content={getStatsText(totalCount, reserved)}
      />
      <Row
        label="stats.noPaidExtension"
        content={getStatsText(totalCount, noPaidExtension)}
      />
      <Row
        label="stats.noPaidPeriod"
        content={getStatsText(totalCount, noPaidPeriod)}
      />
      <Row label="stats.toCheck" content={getStatsText(totalCount, toCheck)} />
      <Row
        label="stats.toExplain"
        content={getStatsText(totalCount, toExplain)}
      />
      <Row
        label="stats.outOfService"
        content={getStatsText(totalCount, outOfService)}
      />
    </div>
  );
};
