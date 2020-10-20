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
  getMyRentList: () => void;
}

const Welcome = ({ userName, getMyRentList, rentsList }: Props) => {
  useEffect(() => {
    getMyRentList();
  }, []);

  return (
    <div className="welcome-wrapper">
      <Section full>
        <SectionHeader title={`${__('application.hi')} ${userName}`} noMargin />
      </Section>
      <Sale />
      <Storage myRentList={rentsList} />
      <OrdersHistory rentHistory={rentsList} />
      <Offers />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  userName: state.user.details.firstName,
  rentsList: state.rent.rentsList,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...singleRent,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
