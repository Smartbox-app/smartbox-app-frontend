import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Section, SectionHeader } from '../../../components/Layout';

import Action from './Action';
import Details from './Details';

interface RouteProps {
  orderId: string;
}
type Props = RouteComponentProps<RouteProps>;

const SingleRentDetail = ({ match }: Props) => {
  console.log('SingleRentDetail', match.params.orderId);
  return (
    <Section full>
      <SectionHeader title="Szczegóły wynajmu" />
      <Action />
      <Details />
    </Section>
  );
};

export default withRouter(SingleRentDetail);
