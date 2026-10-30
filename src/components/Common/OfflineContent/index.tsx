import React from 'react';
import { connect } from 'react-redux';

import { ApplicationState } from 'src/reducers';

interface Props {
  isOnline: boolean;
  children: React.ReactNode;
}

const OfflineContent = ({ isOnline, children }: Props) => {
  if (isOnline) return null;
  return <>{children}</>;
};

const mapStateToProps = (state: ApplicationState) => ({
  isOnline: state.appStatus,
});

export default connect(mapStateToProps)(OfflineContent);
