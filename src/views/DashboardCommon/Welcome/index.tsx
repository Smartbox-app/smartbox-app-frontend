import React from 'react';
import { connect } from 'react-redux';

import { Section, SectionHeader } from '../../../components/Layout';
import { ApplicationState } from '../../../reducers';

import Storage from './Storage';
import Sale from './Sale';
import OrdersHistory from './OrdersHistory';
import Offers from './Offers';
import './Welcome.scss';

interface Props {
  userName: string;
}

const Welcome = ({ userName }: Props) => (
  <div className="welcome-wrapper">
    <Section full>
      <SectionHeader title={`Cześć ${userName}`} noMargin />
    </Section>
    <Sale />
    <Storage />
    <OrdersHistory />
    <Offers />
  </div>
);

const mapStateToProps = (state: ApplicationState) => ({
  userName: state.user.details.firstName,
});

export default connect(mapStateToProps)(Welcome);
