import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Section, SectionHeader } from '../../../components/Layout';

import Action from './Action';
import Details from './Details';
import { singleRent } from '../../../actions';

interface RouteProps {
  orderId: string;
}
interface Props extends RouteComponentProps<RouteProps> {
  fetchMyRentStory: () => void;
}

const SingleRentDetail = ({ match, fetchMyRentStory }: Props) => {
  useEffect(() => {
    console.log('SingleRentDetail', match.params.orderId);
    fetchMyRentStory();
  }, []);

  return (
    <Section full>
      <SectionHeader title="Szczegóły wynajmu" />
      <Action />
      <Details />
    </Section>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default withRouter(connect(null, mapDispatchToProps)(SingleRentDetail));
