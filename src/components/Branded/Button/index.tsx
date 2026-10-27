import React from 'react';

import { Button as UIButton } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';

import 'src/components/Branded/Button/Button.scss';

interface ButtonProps {
  to?: string;
  click?: (event: React.MouseEvent<HTMLButtonElement>) => void;
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

const Button = (props: ButtonProps) => {
  const {
    danger,
    primary,
    secondary,
    success,
    tertiary,
    small,
    disabled,
    big,
    to,
    type,
    blank,
    click,
    text,
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
