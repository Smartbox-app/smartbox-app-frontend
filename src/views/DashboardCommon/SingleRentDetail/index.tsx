import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { Section, SectionHeader } from '../../../components/Layout';

import { singleRent } from '../../../actions';
import { __ } from '../../../helpers/i18n';
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
  getMyRentList: () => void;
}

const SingleRentDetail = ({ loading, match, getSingleRent, singleRent, getMyRentList }: Props) => {
  useEffect(() => {
    (async function() {
      await getMyRentList();
      await getSingleRent(match.params.orderId);
    })();
  }, []);

  return (
    <Section full>
      <SectionHeader title={__('application.rentDetail')} />
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
