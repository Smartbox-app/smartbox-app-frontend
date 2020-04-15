import React from 'react';
import { connect } from 'react-redux';

interface Props {
  isOnline: boolean;
  children: React.ReactNode;
}

const OnlineContent = ({ isOnline, children }: Props) => {
  if (!isOnline) return null;
  return <>{children}</>;
};

const mapStateToProps = (state: any) => ({
  isOnline: state.appStatus,
});

export default connect(mapStateToProps)(OnlineContent);
