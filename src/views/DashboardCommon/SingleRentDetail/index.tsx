import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { Spinner } from '../../../components/Common';
import { Section, SectionHeader } from '../../../components/Layout';

import { singleRent } from '../../../actions';
import { ApplicationState } from '../../../reducers';

import Action from './Action';
import Details from './Details';
import Gate from './Gate';

interface RouteProps {
  orderId: string;
}
interface Props extends RouteComponentProps<RouteProps> {
  loading: boolean;
  singleRent: MyRentList;
  getSingleRent: (rentId: string) => void;
  fetchMyRentStory: () => void;
}

const SingleRentDetail = ({ loading, match, getSingleRent, singleRent, fetchMyRentStory }: Props) => {
  useEffect(() => {
    (async function() {
      await fetchMyRentStory();
      await getSingleRent(match.params.orderId);
    })();
  }, []);

  return (
    <Section full>
      <SectionHeader title="Szczegóły najmu" />
      <Action rentId={singleRent.id} />
      <Details singleRent={singleRent} />
      <Gate />
    </Section>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleRent: state.rent.singleRent,
  loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SingleRentDetail));
