import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ApplicationState } from '../../../reducers';
import { Footer } from '../index';
import './DashboardContainer.scss';

interface Props {
  children: React.ReactNode;
}

const DashboardContainer = ({ children }: Props) => {
  return (
    <div className="dashboard-container">
      {children}
      <Footer />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);
