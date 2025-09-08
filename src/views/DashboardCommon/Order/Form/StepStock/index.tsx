import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { order, stock } from '../../../../../actions';
import {
  Section as InsideSection,
  ButtonsContainer,
} from '../../../../../components/Layout';
import SingleOption from './Tiles/SingleOption';
import { ApplicationState } from '../../../../../reducers';

import UserService from '../../../../../services/user-service';
import './StepStock.scss';
import { useGetMyDetailsQuery } from 'src/queries';
import { Button, Header, Section } from '../../../../../components/ui';
import { __ } from '../../../../../helpers/i18n';
import { Stack } from 'src/components/ui/Stack';
import { ArrowRight } from 'src/icons';
import { useTenant } from 'src/hooks/useTenant';
import { Spinner } from 'src/components/Branded';
import { LocationSelectType } from 'src/smartbox-types/location';
import { Tiles } from './Tiles';
import { Map } from './Map';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

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
    if (!tenant) return <Spinner />;
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
