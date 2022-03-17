import React from 'react';

import './ButtonsContainer.scss';

interface Props {
  children: React.ReactNode;
  max?: boolean;
  className?: string;
  column?: boolean;
  spaceBetween?: boolean;
}

const ButtonsContainer = ({ max, children, column, spaceBetween, className }: Props) => (
  <div
    className={`buttons-container ${max ? 'max' : ''} ${column ? 'column' : ''} ${
      spaceBetween ? 'space-between' : ''
    } ${className || ''}`}
  >
    {children}
  </div>
);

export default ButtonsContainer;
