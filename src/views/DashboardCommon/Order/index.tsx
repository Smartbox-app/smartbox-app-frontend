import React, { useEffect } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';
import { FormContainer, Section, SectionHeader } from '../../../components/Layout';
import { ProgressIndicator } from '../../../components/Common';

import Form from './Form/Index';
import { useDispatch } from 'react-redux';
import { getStockDiscountsList } from '../../../actions/stock';

interface RouteProps {
  step: string;
  rentId: string;
}

type Props = RouteComponentProps<RouteProps>;

const Order = ({ match }: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStockDiscountsList());
  }, []);

  const getStepByName = (stepName: string) => {
    switch (stepName) {
      case 'stock':
        return 1;
      case 'size':
        return 2;
      case 'duration':
        return 3;
      case 'summary':
        return 4;
      case 'agreement':
        return 5;
      case 'payment':
        return 6;
      default:
        return 1;
    }
  };

  return (
    <Section>
      <SectionHeader title={match.params.rentId ? 'application.extendsOrder' : 'application.newOrder'} />
      <ProgressIndicator
        current={getStepByName(match.params.step)}
        stepList={[
          {
            value: 1,
            desc: 'application.orderStepStock',
          },
          {
            value: 2,
            desc: 'application.orderStepSize',
          },
          {
            value: 3,
            desc: 'application.orderStepDate',
          },
          {
            value: 4,
            desc: 'application.orderStepSummary',
          },
          {
            value: 5,
            desc: 'application.orderStepAgreement',
          },
          {
            value: 6,
            desc: 'application.orderStepPayment',
          },
        ]}
      />
      <FormContainer>
        <Form />
      </FormContainer>
    </Section>
  );
};

export default withRouter(Order);
