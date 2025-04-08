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
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { Stack, Button } from 'src/components/ui';
import { ArrowLeft, ArrowRight } from 'src/icons';

const StepSize = () => {
  const { stockId, boxGroupId } = useSelector(
    (state: ApplicationState) => state.order,
  );
  const { data: user } = useGetMyDetailsQuery();

  const [boxGroups, setBoxGroups] = useState<BoxGroupUserRes[]>([]);

  useEffect(() => {
    ApiService.callFetch(
      'GET',
      `box-group-new/all/${stockId}`,
      (boxes: BoxGroupUserRes[]) => {
        setBoxGroups(boxes);
      },
    );
  }, []);

  const options = [...boxGroups]
    .sort((a, b) =>
      a.area && b.area ? a.area - b.area : a.name > b.name ? 1 : -1,
    )
    .map((data: BoxGroupUserRes) => (
      <SingleOption key={data.id} singleOptionData={data} />
    ));

  return (
    <form>
      <Stack>
        <Section>
          <Header variant="h2">{__('application.orderFormPickSize')}</Header>{' '}
          <div className="options-wrapper">{options}</div>
          {boxGroups.length === 0 && (
            <Alert type="notice" text="application.noBoxesInThisStock" />
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
