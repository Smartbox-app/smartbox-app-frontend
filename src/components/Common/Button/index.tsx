import React from 'react';
import { Link } from 'react-router-dom';

import './Button.scss';
import {__} from "../../../helpers/i18n";

interface ButtonProps {
  to?: string;
  click?: any;
  primary?: boolean;
  danger?: boolean;
  success?: boolean;
  outline?: boolean;
  disabled?: boolean;
  tertiary?: boolean;
  auto?: boolean;
  type?: string;
  text: string;
  big?: boolean;
  small?: boolean;
  className?: string;
  blank?: boolean;
  rounded?: boolean;
  icon?: string;
  onlyIcon?: boolean;
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
    tertiary,
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
    rounded,
    icon,
    onlyIcon,
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

  const imgLink = `/assets/icons/${icon}`;
  const imgComponent = <img className="button-img" src={imgLink} alt="img" />;

  const buttonClass = `button
    ${className || ''} ${primary ? 'button-primary' : ''}
    ${danger ? 'button-danger' : ''} ${success ? 'button-success' : ''}
    ${outline ? 'button-outline' : ''} ${big ? 'button-big' : ''}
    ${small ? 'button-small' : ''} ${auto ? 'auto' : ''}
    ${icon ? 'with-icon' : ''} ${onlyIcon ? 'only-icon' : ''}
    ${disabled ? 'disabled' : ''} ${rounded ? 'rounded' : ''} ${tertiary ? 'button-tertiary' : ''}`;

  if (to) {
    if (disabled) {
      return (
        <a className={buttonClass}>
          {icon && imgComponent}
          {!onlyIcon && __(text)}
        </a>
      );
    }
    if (blank) {
      return (
        <a target="_blank" rel="noopener noreferrer" className={buttonClass} href={to}>
          {icon && imgComponent}
          {!onlyIcon && __(text)}
        </a>
      );
    }
    return (
      <Link className={buttonClass} to={to}>
        {icon && imgComponent}
        {!onlyIcon && __(text)}
      </Link>
    );
  }

  return (
    <button type={setButtonType(type) || 'button'} disabled={disabled} onClick={click} className={buttonClass}>
      {icon && imgComponent}
      {!onlyIcon && __(text)}
    </button>
  );
};

export default Button;
