import * as React from 'react';
import './Alert.scss';

interface AlertProps {
  type: string;
  text: string;
  simple?: boolean;
  notification?: boolean;
}

const Alert = ({ type, simple, notification, text }: AlertProps) => (
  <div className={`alert alert-${type} ${simple ? 'alert-simple' : ''} ${notification ? 'notification' : ''}`}>
    {text}
  </div>
);

export default Alert;
