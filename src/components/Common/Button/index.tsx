import React from 'react';
import { Link } from 'react-router-dom';

import './Button.scss';

interface ButtonProps {
  to?: string;
  click?: any;
  primary?: boolean;
  danger?: boolean;
  success?: boolean;
  outline?: boolean;
  disabled?: boolean;
  auto?: boolean;
  type?: string;
  text: string;
  big?: boolean;
  small?: boolean;
  className?: string;
  blank?: boolean;
}

enum ButtonType {
  Submit = 'submit',
  Button = 'button',
  Reset = 'reset',
}

const Button = (props: ButtonProps): any => {
  const {
    className,
    danger,
    primary,
    success,
    small,
    disabled,
    outline,
    big,
    auto,
    to,
    type,
    blank,
    click,
    text,
  } = props;

  const setButtonType = (userinput = 'button'): any => {
    switch (userinput) {
      case ButtonType.Button:
        return 'button';
      case ButtonType.Submit:
        return 'submit';
      default:
        return 'button';
    }
  };

  const buttonClass = `button
    ${className || ''} ${primary ? 'button-primary' : ''}
    ${danger ? 'button-danger' : ''} ${success ? 'button-success' : ''}
    ${outline ? 'button-outline' : ''} ${big ? 'button-big' : ''}
    ${small ? 'button-small' : ''} ${auto ? 'auto' : ''}
    ${disabled ? 'disabled' : ''}`;

  if (to) {
    if (disabled) {
      return <a className={buttonClass}>{text}</a>;
    }
    if (blank) {
      return (
        <a target="_blank" rel="noopener noreferrer" className={buttonClass} href={to}>
          {text}
        </a>
      );
    }
    return (
      <Link className={buttonClass} to={to}>
        {text}
      </Link>
    );
  }

  return (
    <button type={setButtonType(type) || 'button'} disabled={disabled} onClick={click} className={buttonClass}>
      {text}
    </button>
  );
};

export default Button;
