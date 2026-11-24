import React, { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router';

import { BoxGroupUserRes } from 'smartbox-types';
import { Alert } from 'src/components/Common';
import {
  ButtonsContainer,
} from 'src/components/Layout';
import { Header, Section, Skeleton , Stack, Button } from 'src/components/ui';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { useBoxGroupsForStockQuery, useGetMyDetailsQuery } from 'src/queries';
import { useOrderStep } from 'src/views/DashboardCommon/Order/RouteWithIndicator';
import { useOrderPaths } from 'src/views/DashboardCommon/Order/useOrderPaths';

import SingleOption from './SingleOption';

import './StepSize.scss';

const StepSize = () => {
  useOrderStep('size');
  const { stockId } = useParams<{ stockId: string }>();
  const { search } = useLocation();
  const { data: user } = useGetMyDetailsQuery();
  const { goToStockSelect, goToDuration } = useOrderPaths();
  const { getText } = useTenantNaming();
  const { data: boxGroups = [], isPending: loading } =
    useBoxGroupsForStockQuery(stockId);
  const requestedGroupId = new URLSearchParams(search).get('group');
  const boxGroupId = boxGroups.some(
    (group) => group.id === requestedGroupId && group.available,
  )
    ? requestedGroupId
    : null;

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

  useEffect(() => {
    if (!stockId) goToStockSelect();
  }, [stockId, goToStockSelect]);

  if (!stockId || !user) return null;

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
              type="button"
              text="application.back"
              onClick={() => goToStockSelect(stockId)}
              iconLeft={<ArrowLeft />}
            />
            <Button
              type="button"
              size="large"
              onClick={() =>
                boxGroupId && goToDuration({ stockId, boxGroupId })
              }
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
