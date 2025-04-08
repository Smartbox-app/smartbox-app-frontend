import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { order, stock } from '../../../../../actions';
import {
  Section as InsideSection,
  ButtonsContainer,
} from '../../../../../components/Layout';
import SingleOption from './SingleOption';
import { ApplicationState } from '../../../../../reducers';

import UserService from '../../../../../services/user-service';
import './StepStock.scss';
import { useGetMyDetailsQuery } from 'src/queries';
import { Button, Header, Section } from '../../../../../components/ui';
import { __ } from '../../../../../helpers/i18n';
import { Stack } from 'src/components/ui/Stack';
import { ArrowRight } from 'src/icons';

const StepStock = () => {
  const dispatch = useDispatch();
  const stockId = useSelector((state: ApplicationState) => state.order.stockId);
  const list = useSelector((state: ApplicationState) => state.stock.list);
  const groupsList = useSelector(
    (state: ApplicationState) => state.stockGroup.list,
  );
  const { data: user } = useGetMyDetailsQuery();

  useEffect(() => {
    if (!user) return;

    dispatch(order.clearOrder());
  }, []);

  if (!user) return null;
  return (
    <form>
      <Stack>
        <Section>
          <Header variant="h2">{__('application.orderFormPickStock')}</Header>

          {groupsList.map((group) => (
            <InsideSection key={group.id} highlight>
              <Header variant="h3">{group.name}</Header>
              <div className="group-stocks-wrapper">
                {group.stocks.map((el) => (
                  <SingleOption
                    key={el.id}
                    value={el.id}
                    name={el.name}
                    address={el.address}
                  />
                ))}
              </div>
            </InsideSection>
          ))}
          <div className="stocks-wrapper">
            {list.map((el) => (
              <SingleOption
                key={el.id}
                value={el.id}
                name={el.name}
                address={el.address}
              />
            ))}
          </div>
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
