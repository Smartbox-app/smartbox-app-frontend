import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { BoxMapRes } from 'smartbox-types';
import { showModal } from 'src/actions/modal';
import { Spinner } from 'src/components/Branded';
import { Section } from 'src/components/Layout';
import { Header } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useGetStockBoxesQuery, useGetStockQuery } from 'src/queries';
import BoxDetail from '../../../../BoxDetail';
import { MapView } from '../../../../MapView';

const Handling = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const dispatch = useDispatch();
  const { getText } = useTenantNaming();
  const { data: stock, isPending: stockLoading } = useGetStockQuery(stockId);
  const { data: boxes = [], isPending: boxesLoading } =
    useGetStockBoxesQuery(stockId);

  const handleBoxDetails = (box: BoxMapRes) => {
    if (!stock) return;
    dispatch(showModal(<BoxDetail box={box} stockId={stock.id} />));
  };

  if (stockLoading || boxesLoading || !stock) return <Spinner />;

  return (
    <Section>
      <Header variant="h2">{getText('handling')}</Header>
      <MapView stock={stock} boxes={boxes} admin onBoxClick={handleBoxDetails} />
    </Section>
  );
};

export { Handling };
