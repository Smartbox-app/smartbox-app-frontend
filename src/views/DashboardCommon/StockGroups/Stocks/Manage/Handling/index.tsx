import React from 'react';
import { useParams } from 'react-router';
import { BoxMapRes } from 'smartbox-types';
import { Section } from '../../../../../../components/Layout';
import { Spinner } from '../../../../../../components/Branded';
import { MapView } from '../../../../MapView';
import { useDispatch } from 'react-redux';
import BoxDetail from '../../../../BoxDetail';
import { showModal } from '../../../../../../actions/modal';
import { Header } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { useGetStockBoxesQuery, useGetStockQuery } from 'src/queries';

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
