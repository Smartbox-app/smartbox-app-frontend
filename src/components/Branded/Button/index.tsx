import { Button as UIButton } from 'src/components/ui';
import { __ } from '../../../helpers/i18n';
import './Button.scss';
import React from 'react';

interface ButtonProps {
  to?: string;
  click?: any;
  primary?: boolean;
  secondary?: boolean;
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

const Button = (props: ButtonProps) => {
  const {
    className,
    danger,
    primary,
    secondary,
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

  const getSize = () => {
    if(big) return 'large'
    if(small) return 'small'
  }

  const getVariant = () => {
    if(primary) return 'primary';
    if(secondary) return 'secondary';
    if(danger) return 'error';
    if(tertiary) return 'tertiary';
    if(success) return 'success';
  }

  const getType = () => {
    if(type === 'submit') return 'submit';
      return 'button';
  }

  return <UIButton variant={getVariant()} to={blank ? undefined : to} href={blank ? to : undefined} onClick={click} text={text} size={getSize()} type={getType()} disabled={disabled}/>;
};

export { Button };
