import React from 'react';
import { connect } from 'react-redux';

import Notification from 'src/components/Notifications/Notification';
import { ApplicationState } from 'src/reducers';
import { SingleNotification } from 'src/types/notifications';

import 'src/components/Notifications/NotificationContainer/NotificationContainer.scss';

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
