import * as React from 'react';
import './Alert.scss';
import {__} from "../../../helpers/i18n";

interface AlertProps {
  type: string | 'error' | 'error-notification' | 'notice' | 'warning' | 'primary' | 'success' | 'disabled';
  text: string;
  simple?: boolean;
  notification?: boolean;
}
const marker = (type: string) => {
  if (type === 'success') {
    // eslint-disable-next-line no-unused-expressions
    return <i className="fa fa-check-circle notification-marker" aria-hidden="true" />;
  } else if (type === 'error-notification' || type === 'error') {
    // eslint-disable-next-line no-unused-expressions
    return <i className="fa fa-times-circle notification-marker" aria-hidden="true" />;
  } else if (type === 'primary') {
    // eslint-disable-next-line no-unused-expressions
    return <i className="fa fa-exclamation-circle notification-marker" aria-hidden="true" />;
  }
};

const Alert = ({ type, simple, notification, text }: AlertProps) => (
  <div className={`alert alert-${type === 'error-notification'? 'error': type} ${simple ? 'alert-simple' : ''} ${notification ? 'notification' : ''}`}>
    {marker(type)}
      {type === 'error-notification' ? text : __(text)}
  </div>
);

export default Alert;
