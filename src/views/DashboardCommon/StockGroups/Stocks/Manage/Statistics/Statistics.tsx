import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ApiService from '../../../../../../services/api-service';
import { StockStatistics } from 'smartbox-types';
import { Section } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';

import { Header, Tabs } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { Row } from 'src/components/Common';
import { StatusStats } from './components/StatusStats';
import styled from 'styled-components';
import { SingleTab } from 'src/types/tab';
import { RentsStats } from './components/RentsStats';
import { PaymentsStats } from './components/PaymentsStats';

const StyledStats = styled('div')(({ theme }) => ({
  padding: `${theme.spacing * 4}px`,
  borderRadius: `${theme.spacing * 4}px`,
  border: `1px solid ${theme.colors.secondary}`,
}));

export const Statistics = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const [statistics, setStatistics] = useState<StockStatistics>();
  const { getText } = useTenantNaming();
  const [loading, setLoading] = useState<boolean>(true);
  const [tab, setTab] = useState<'payments' | 'rents'>('rents');

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

  const getStatistics = async () => {
    await ApiService.callFetch(
      'GET',
      `stock/${stockId}/statistics`,
      (res: StockStatistics) => {
        setStatistics(res);
      },
    );
    setLoading(false);
  };

  useEffect(() => {
    getStatistics();
  }, []);

  if (loading || !statistics) return <Spinner />;

  return (
    <Section>
      <Header variant="h2">{getText('stats')}</Header>
      <Tabs tabs={tabs} />
      {tab === 'rents' ? (
        <RentsStats statistics={statistics} />
      ) : (
        <PaymentsStats statistics={statistics} />
      )}
    </Section>
  );
};
