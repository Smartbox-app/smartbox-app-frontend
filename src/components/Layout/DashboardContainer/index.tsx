import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { UserEntity } from 'ideapv-types';

import './DashboardContainer.scss';
// import { Spinner } from '../../Common';

interface Props {
  children: React.ReactNode;
  user?: UserEntity;
}

const DashboardContainer = ({ user, children }: Props) => (
  // if (!user) return <Spinner />;
  <div className="dashboard-container">{children}</div>
);
const mapStateToProps = (state: any) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
