import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reducers';

import './DashboardContainer.scss';
import {Footer} from "../index";

interface Props {
  children: React.ReactNode;
}

const DashboardContainer = ({children}: Props) =>
    <div className="dashboard-container">
      {children}
      <Footer/>
    </div>;

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
