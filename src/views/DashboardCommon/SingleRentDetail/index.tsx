import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Section } from '../../../components/Layout';

interface RouteProps {
  userId: string;
}
type Props = RouteComponentProps<RouteProps>;

const SingleRentDetail = ({ match }: Props) => {
  console.log('SingleRentDetail');
  return (
    <Section full>
      <h1>SingleRentDetail {match.params.userId}</h1>
    </Section>
  );
};

export default withRouter(SingleRentDetail);
