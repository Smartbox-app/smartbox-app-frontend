import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BoxGroupUserRes } from 'smartbox-types';
import {
  FormContainer,
  ButtonsContainer,
} from '../../../../../components/Layout';
import SingleOption from './SingleOption';
import { ApplicationState } from '../../../../../reducers';
import FormHeader from '../../../../../components/Layout/FormHeader';
import UserService from '../../../../../services/user-service';
import ApiService from '../../../../../services/api-service';

import './StepSize.scss';
import { Alert } from '../../../../../components/Common';
import { useGetMyDetailsQuery } from 'src/queries';
import { Header, Section, Skeleton } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { Stack, Button } from 'src/components/ui';
import { ArrowLeft, ArrowRight } from 'src/icons';
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { Redirect } from 'react-router';

const StepSize = () => {
  const { stockId, boxGroupId } = useSelector(
    (state: ApplicationState) => state.order,
  );
  const { data: user } = useGetMyDetailsQuery();
  const { getText } = useTenantNaming();
  const [loading, setLoading] = useState<boolean>(true);
  const [boxGroups, setBoxGroups] = useState<BoxGroupUserRes[]>([]);

  useEffect(() => {
    if (!stockId) return;
    setLoading(true);
    ApiService.callFetch(
      'GET',
      `box-group-new/all/${stockId}`,
      (boxes: BoxGroupUserRes[]) => {
        setBoxGroups(boxes);
        setLoading(false);
      },
    );
  }, []);

  const getSortingCriteria = (a: BoxGroupUserRes, b: BoxGroupUserRes) => {
    if (a.order && b.order) return a.order - b.order;
    if (a.area && b.area) return a.area - b.area;
    return a.name > b.name ? 1 : -1;
  };

  const options = [...boxGroups]
    .sort((a, b) => getSortingCriteria(a, b))
    .map((data: BoxGroupUserRes) => (
      <SingleOption key={data.id} singleOptionData={data} />
    ));

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
