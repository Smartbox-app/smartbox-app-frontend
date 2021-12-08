import React, { useEffect } from 'react';

import { withRouter, RouteComponentProps } from 'react-router';
import { FormContainer, Section, SectionHeader } from '../../../components/Layout';
import { ProgressIndicator } from '../../../components/Common';

import Form from './Form/Index';
import { __ } from '../../../helpers/i18n';
import { useDispatch } from 'react-redux';
import { order } from '../../../actions';

interface RouteProps {
  step: string;
  rentId: string;
}

type Props = RouteComponentProps<RouteProps>;

const Order = ({ match }: Props) => {
  const getStepByName = (stepName: string) => {
    switch (stepName) {
      case 'size':
        return 1;
      case 'duration':
        return 2;
      case 'summary':
        return 3;
      case 'agreement':
        return 4;
      case 'payment':
        return 5;
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
            desc: __('application.orderStepSize'),
          },
          {
            value: 2,
            desc: __('application.orderStepDate'),
          },
          {
            value: 3,
            desc: __('application.orderStepSummary'),
          },
          {
            value: 4,
            desc: __('application.orderStepAgreement'),
          },
          {
            value: 5,
            desc: __('application.orderStepPayment'),
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
