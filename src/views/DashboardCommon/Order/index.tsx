import React from 'react';

import { withRouter, RouteComponentProps } from 'react-router';
import { FormContainer, Section, SectionHeader } from '../../../components/Layout';
import { ProgressIndicator } from '../../../components/Common';

import Form from './Form/Index';

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
      <SectionHeader title="Nowe zamówienie:" />
      <ProgressIndicator
        current={getStepByName(match.params.step)}
        stepList={[
          {
            value: 1,
            desc: 'Rozmiar',
          },
          {
            value: 2,
            desc: 'Termin',
          },
          {
            value: 3,
            desc: 'Podsumowanie',
          },
          {
            value: 4,
            desc: 'Umowa',
          },
          {
            value: 5,
            desc: 'Płatność',
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
