import React from 'react';

import './ButtonsContainer.scss';

interface Props {
  children: React.ReactNode;
  max?: boolean;
  column?: boolean;
  spaceBetween?: boolean;
}

const ButtonsContainer = ({ max, children, column, spaceBetween }: Props) => (
  <div
    className={`buttons-container ${max ? 'max' : ''} ${column ? 'column' : ''} ${spaceBetween ? 'space-between' : ''}`}
  >
    {children}
  </div>
);

export default ButtonsContainer;
