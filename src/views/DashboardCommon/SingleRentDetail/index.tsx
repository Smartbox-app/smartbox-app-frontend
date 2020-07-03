import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { Section, SectionHeader } from '../../../components/Layout';

import Action from './Action';
import Details from './Details';
import { singleRent } from '../../../actions';
import { ApplicationState } from '../../../reducers';

interface RouteProps {
  orderId: string;
}
interface Props extends RouteComponentProps<RouteProps> {
  singleRent: MyRentList;
  getSingleRent: (rentId: string) => void;
}

const SingleRentDetail = ({ match, getSingleRent, singleRent }: Props) => {
  useEffect(() => {
    getSingleRent(match.params.orderId);
  });

  return (
    <Section full>
      <SectionHeader title="Szczegóły wynajmu" />
      <Action />
      <Details singleRent={singleRent} />
    </Section>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleRentDetail));
