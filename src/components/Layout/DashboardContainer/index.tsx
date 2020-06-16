import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserRes } from 'smartbox-types';
import { ApplicationState } from '../../../reducers';

import './DashboardContainer.scss';

interface Props {
  children: React.ReactNode;
  user: UserRes;
}

const DashboardContainer = ({ user, children }: Props) => <div className="dashboard-container">{children}</div>;
const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
