import React from 'react';

import './ButtonsContainer.scss';

interface Props {
  children: React.ReactNode;
  max?: boolean;
  column?: boolean;
}

const ButtonsContainer = ({ max, children, column }: Props) => (
  <div className={`buttons-container ${max ? 'max' : ''} ${column ? 'column' : ''}`}>{children}</div>
);

export default ButtonsContainer;
