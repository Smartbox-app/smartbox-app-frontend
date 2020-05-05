import React from 'react';
import { connect } from 'react-redux';

import { Section } from '../../../components/Layout';
import { ProgressIndicator } from '../../../components/Common';
import Form from './Form/Index';

interface Props {
  userName: string;
  formStep: number;
}

const Order = ({ userName, formStep }: Props) => {
  console.log('Order', userName);
  return (
    <>
      <Section>
        <h3 className="welcome">Nowe zamówienie:</h3>
        <ProgressIndicator
          current={formStep}
          data={[
            {
              value: 1,
              desc: 'Etap 1',
            },
            {
              value: 2,
              desc: 'Etap 2',
            },
            {
              value: 3,
              desc: 'Etap 3',
            },
            {
              value: 4,
              desc: 'Etap 4',
            },
          ]}
        />
        <Form />
      </Section>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  userName: state.user.details.firstName,
  formStep: state.order.formStep,
});

export default connect(mapStateToProps)(Order);
