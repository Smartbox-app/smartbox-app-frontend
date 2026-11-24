import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';

import { order } from 'src/actions';
import { ButtonsContainer } from 'src/components/Layout';
import {
  Button,
  Header,
  Section,
  Skeleton,
} from 'src/components/ui';
import { Stack } from 'src/components/ui/Stack';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { ArrowRight } from 'src/icons';
import {
  useGetMyDetailsQuery,
  useGetStockGroupsListQuery,
  useGetStockListQuery,
} from 'src/queries';
import { LocationSelectType } from 'src/smartbox-types/location';
import { useOrderStep } from 'src/views/DashboardCommon/Order/RouteWithIndicator';
import { useOrderPaths } from 'src/views/DashboardCommon/Order/useOrderPaths';

import { Map } from './Map';
import { Tiles } from './Tiles';

import './StepStock.scss';

const StepStock = () => {
  useOrderStep('stock');
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { data: user } = useGetMyDetailsQuery();
  const { data: stocks } = useGetStockListQuery(!!user);
  const { data: groups } = useGetStockGroupsListQuery(!!user);
  const { goToSize } = useOrderPaths();
  const { tenant } = useTenant();
  const { getText } = useTenantNaming();
  const requestedStockId = new URLSearchParams(search).get('stock');
  const stockId =
    requestedStockId &&
    (stocks?.some((item) => item.id === requestedStockId) ||
      groups?.some((group) =>
        group.stocks.some((item) => item.id === requestedStockId),
      ))
      ? requestedStockId
      : null;

  useEffect(() => {
    if (!user) return;

    dispatch(order.clearOrder());
  }, []);

  const getLocationSelect = () => {
    if (!tenant) return <Skeleton height={150} />;
    switch (tenant.locationSelectType) {
      case LocationSelectType.Tiles:
        return <Tiles />;
      case LocationSelectType.Map:
        return <Map />;
    }
  };

  if (!user) return null;
  return (
    <form>
      <Stack>
        <Section>
          <Header variant="h2">{getText('please_pick')}</Header>

          {getLocationSelect()}
        </Section>
        <Section>
          <ButtonsContainer spaceBetween>
            <span />
            <Button
              type="button"
              size="large"
              text="application.next"
              disabled={!stockId}
              iconRight={<ArrowRight />}
              onClick={() => stockId && goToSize(stockId)}
            />
          </ButtonsContainer>
        </Section>
      </Stack>
    </form>
  );
};

export default StepStock;
