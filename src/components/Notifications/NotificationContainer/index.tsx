import React from 'react';
import { connect } from 'react-redux';

import { SingleNotification } from '../../../types/notifications';
import { ApplicationState } from '../../../reducers';

import Notification from '../Notification';

import './NotificationContainer.scss';

interface Props {
  notifications: SingleNotification[];
}

const Notifications = ({ notifications }: Props) => {
  const mapped = notifications.map((notification: SingleNotification) => (
    <Notification key={notification.id} notification={notification} />
  ));

  return <div className="notification-container">{mapped}</div>;
};

const mapStateToProps = (state: ApplicationState) => ({
  notifications: state.notifications,
});

export default connect(mapStateToProps)(Notifications);
