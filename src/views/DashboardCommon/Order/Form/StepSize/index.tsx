import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BoxGroupUserRes } from 'smartbox-types';
import {
  ButtonsContainer,
} from '../../../../../components/Layout';
import SingleOption from './SingleOption';
import { ApplicationState } from '../../../../../reducers';

import UserService from '../../../../../services/user-service';

import './StepSize.scss';
import { Alert } from '../../../../../components/Common';
import { useBoxGroupsForStockQuery, useGetMyDetailsQuery } from 'src/queries';
import { Header, Section, Skeleton , Stack, Button } from 'src/components/ui';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { Redirect } from 'react-router';

const StepSize = () => {
  const { stockId, boxGroupId } = useSelector(
    (state: ApplicationState) => state.order,
  );
  const { data: user } = useGetMyDetailsQuery();
  const { getText } = useTenantNaming();
  const { data: boxGroups = [], isPending: loading } =
    useBoxGroupsForStockQuery(stockId);

  const getSortingCriteria = (a: BoxGroupUserRes, b: BoxGroupUserRes) => {
    if (a.order && b.order) return a.order - b.order;
    if (a.area && b.area) return a.area - b.area;
    return a.name > b.name ? 1 : -1;
  };

  const options = useMemo(
    () =>
      [...boxGroups]
        .sort((a, b) => getSortingCriteria(a, b))
        .map((data: BoxGroupUserRes) => (
          <SingleOption key={data.id} singleOptionData={data} />
        )),
    [boxGroups],
  );

  if (!stockId) return <Redirect to="/user/order/step/stock" />;

  return (
    <form>
      <Stack>
        <Section>
          <Header variant="h2">{getText('please_pick_box_size')}</Header>{' '}
          <div className="options-wrapper">
            {loading ? (
              <>
                <Skeleton radius={16} height={450} />
                <Skeleton radius={16} height={450} />
                <Skeleton radius={16} height={450} />
              </>
            ) : (
              options
            )}
          </div>
          {boxGroups.length === 0 && (
            <Alert type="notice" text={getText('no_boxes')} />
          )}
        </Section>

        <Section>
          <ButtonsContainer spaceBetween>
            <Button
              variant="secondary"
              size="large"
              text="application.back"
              to="/user/order/step/stock"
              iconLeft={<ArrowLeft />}
            />
            <Button
              type="submit"
              size="large"
              to={`/${UserService.getSlugByRole(user!.role)}/order/step/duration`}
              text="application.next"
              iconRight={<ArrowRight />}
              disabled={!boxGroupId}
            />
          </ButtonsContainer>
        </Section>
      </Stack>
    </form>
  );
};

export default StepSize;
