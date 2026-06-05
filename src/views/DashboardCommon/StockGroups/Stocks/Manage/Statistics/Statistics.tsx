import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Section } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';

import { Header, Tabs } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { SingleTab } from 'src/types/tab';
import {
  useGetStockQuery,
  useGetStockStatisticsQuery,
} from 'src/queries';
import { RentsStats } from './components/RentsStats';
import { PaymentsStats } from './components/PaymentsStats';
import { getStockStatusColors } from './utils/stock-status-colors';

export const Statistics = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { getText } = useTenantNaming();
  const [tab, setTab] = useState<'payments' | 'rents'>('rents');

  const { data: statistics, isPending: statisticsLoading } =
    useGetStockStatisticsQuery(stockId);
  const { data: stock, isPending: stockLoading } = useGetStockQuery(stockId);

  const tabs: SingleTab[] = [
    {
      text: 'stats.rents',
      onClick: () => setTab('rents'),
      active: tab === 'rents',
    },
    {
      text: 'stats.payments',
      onClick: () => setTab('payments'),
      active: tab === 'payments',
    },
  ];

  if (statisticsLoading || stockLoading || !statistics || !stock) {
    return <Spinner />;
  }

  const statusColors = getStockStatusColors(stock);

  return (
    <Section>
      <Header variant="h2">{getText('stats')}</Header>
      <Tabs tabs={tabs} />
      {tab === 'rents' ? (
        <RentsStats statistics={statistics} statusColors={statusColors} />
      ) : (
        <PaymentsStats statistics={statistics} />
      )}
    </Section>
  );
};
