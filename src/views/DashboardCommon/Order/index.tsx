import React from 'react';
import { connect } from 'react-redux';

import { Section, SectionHeader } from '../../../components/Layout';
import { ProgressIndicator } from '../../../components/Common';
import Form from './Form/Index';

interface Props {
  userName: string;
  formStep: number;
}

const Order = ({ userName, formStep }: Props) => (
  <>
    <Section>
      <SectionHeader title="Nowe zamówienie:" />
      <ProgressIndicator
        current={formStep}
        data={[
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
      <Form />
    </Section>
  </>
);

const mapStateToProps = (state: any) => ({
  userName: state.user.details.firstName,
  formStep: state.order.formStep,
});

export default connect(mapStateToProps)(Order);
