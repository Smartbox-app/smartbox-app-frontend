import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Section } from '../../../components/Layout';

interface RouteProps {
  orderId: string;
}
type Props = RouteComponentProps<RouteProps>;

const SingleRentDetail = ({ match }: Props) => {
  console.log('SingleRentDetail', match.params.orderId);
  return (
    <Section full>
      <h1>SingleRentDetail</h1>
      <h2>{match.params.orderId}</h2>
    </Section>
  );
};

export default withRouter(SingleRentDetail);
