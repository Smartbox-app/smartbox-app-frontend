import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { Section, SectionHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { __ } from '../../../helpers/i18n';

import { singleRent } from '../../../actions';
import Storage from './Storage';
import Sale from './Sale';
import OrdersHistory from './OrdersHistory';
import Offers from './Offers';

import './Welcome.scss';

interface Props {
  userName: string;
  rentsList: MyRentList[];
  rentsHistoryList: MyRentList[];
  getMyRentList: () => void;
  fetchMyRentHistory: () => void;
}

const Welcome = ({ userName, getMyRentList, rentsList, fetchMyRentHistory, rentsHistoryList }: Props) => {
  useEffect(() => {
    getMyRentList();
    fetchMyRentHistory();
  }, []);

  return (
    <div className="welcome-wrapper">
      <Section full>
        <SectionHeader title={`${__('application.hi')} ${userName}`} noMargin />
      </Section>
      <Sale />
      <Storage myRentList={rentsList} />
      <OrdersHistory rentsHistoryList={rentsHistoryList} />
      <Offers />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  userName: state.user.details.firstName,
  rentsList: state.rent.rentsList,
  rentsHistoryList: state.rent.rentsHistoryList,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
