import * as React from 'react';
import './Alert.scss';

interface AlertProps {
  type: string;
  text: string;
  simple?: boolean;
  notification?: boolean;
}
const marker = (type: string) => {
  if (type === 'success') {
    // eslint-disable-next-line no-unused-expressions
    return <i className="fa fa-check-circle notification-marker" aria-hidden="true" />;
  } else if (type === 'error') {
    // eslint-disable-next-line no-unused-expressions
    return <i className="fa fa-check-circle notification-marker" aria-hidden="true" />;
  }
};

const Alert = ({ type, simple, notification, text }: AlertProps) => (
  <div className={`alert alert-${type} ${simple ? 'alert-simple' : ''} ${notification ? 'notification' : ''}`}>
    {marker(type)}
    {text}
  </div>
);

export default Alert;
