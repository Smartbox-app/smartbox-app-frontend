import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { notifications } from '../../../actions';
import { SingleNotification } from '../../../types/notifications';

import { Alert } from '../../Common';

import './Notification.scss';

interface Props {
  notification: SingleNotification;
  hideNotification: (id: string) => void;
}

class Notification extends React.Component<Props> {
  timeout: any;

  componentDidMount() {
    this.timeout = setTimeout(() => {
      // this.hideNotification();
    }, 5000);
  }

  private hideNotification = () => {
    const { notification, hideNotification } = this.props;
    if (notification.id) {
      hideNotification(notification.id);
    }
  };

  render() {
    const { notification } = this.props;
    return (
      <div onClick={this.hideNotification} className="notification" role="button" tabIndex={0}>
        <Alert notification type={notification.type} text={notification.text} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      hideNotification: notifications.hideNotification,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Notification);
