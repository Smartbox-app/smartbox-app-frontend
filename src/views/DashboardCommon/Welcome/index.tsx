import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { Section, SectionHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';

import { singleRent } from '../../../actions';
import Storage from './Storage';
import Sale from './Sale';
import OrdersHistory from './OrdersHistory';
import Offers from './Offers';

import './Welcome.scss';

interface Props {
  userName: string;
  rentsList: MyRentList[];
  fetchMyRentStory: () => void;
}

const Welcome = ({ userName, fetchMyRentStory, rentsList }: Props) => {
  useEffect(() => {
    // console.log('SingleRentDetail', match.params.orderId);
    fetchMyRentStory();
  }, []);

  return (
    <div className="welcome-wrapper">
      <Section full>
        <SectionHeader title={`Cześć ${userName}`} noMargin />
      </Section>
      <Sale />
      <Storage myRentList={rentsList} />
      <OrdersHistory />
      <Offers />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  userName: state.user.details.firstName,
  rentsList: state.singleRent.rentsList,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
