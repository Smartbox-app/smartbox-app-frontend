import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
import { useGetMyDetailsQuery } from 'src/queries';
import { ApplicationState } from 'src/reducers';
import UserService from 'src/services/user-service';
import { LocationSelectType } from 'src/smartbox-types/location';
import { Map } from './Map';
import { Tiles } from './Tiles';

import './StepStock.scss';

const StepStock = () => {
  const dispatch = useDispatch();
  const stockId = useSelector((state: ApplicationState) => state.order.stockId);
  const { data: user } = useGetMyDetailsQuery();
  const { tenant } = useTenant();
  const { getText } = useTenantNaming();

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
              to={`/${UserService.getSlugByRole(user!.role)}/order/step/size`}
              type="submit"
              size="large"
              text="application.next"
              disabled={!stockId}
              iconRight={<ArrowRight />}
            />
          </ButtonsContainer>
        </Section>
      </Stack>
    </form>
  );
};

export default StepStock;
