import React, { useEffect } from 'react';
import { connect, useSelector } from 'react-redux';

import { bindActionCreators } from 'redux';
import { MyRentList } from 'smartbox-types';
import { PageHeader, Section, SectionHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';
import { __ } from '../../../helpers/i18n';

import { singleRent } from '../../../actions';
import Storage from './Storage';
import Sale from './Sale';
import OrdersHistory from './OrdersHistory';
import {Offers} from './Offers';

import './Welcome.scss';

interface Props {
  rentsList: MyRentList[];
  rentsHistoryList: MyRentList[];
  loading: boolean;
  getMyRentList: () => void;
  fetchMyRentHistory: () => void;
}

const Welcome = ({ getMyRentList, rentsList, fetchMyRentHistory, rentsHistoryList, loading }: Props) => {
    const user = useSelector((state: ApplicationState) => state.user.details!);
  useEffect(() => {
    getMyRentList();
    fetchMyRentHistory();
  }, []);

  return (
    <div className="welcome-wrapper">
      <Section full>
        <PageHeader title={`${__('application.hi')} ${user.firstName}`} />
      </Section>
      <Sale />
      <Offers />
      <Storage myRentList={rentsList} loading={loading} />
      <OrdersHistory rentsHistoryList={rentsHistoryList} />
    
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  rentsList: state.rent.rentsList,
  rentsHistoryList: state.rent.rentsHistoryList,
  loading: state.rent.loading,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
