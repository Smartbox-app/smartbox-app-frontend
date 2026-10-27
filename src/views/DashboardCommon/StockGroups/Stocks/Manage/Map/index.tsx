import React from 'react';
import { useParams } from 'react-router';

import { Spinner } from 'src/components/Branded';
import { Section } from 'src/components/Layout';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useGetStockBoxesQuery, useGetStockQuery } from 'src/queries';
import { MapView } from '../../../../MapView';
import { MapSettingsForm } from './MapSettingsForm';

const Map = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const { data: stock, isPending: stockLoading } = useGetStockQuery(stockId);
  const { data: boxes = [], isPending: boxesLoading } =
    useGetStockBoxesQuery(stockId);
  if (stockLoading || boxesLoading || !stock) return <Spinner />;

  return (
    <Section>
      <Header variant="h2">{__('application.map')}</Header>
      <MapSettingsForm stock={stock} />
      <MapView stock={stock} boxes={boxes} />
    </Section>
  );
};

export { Map };
