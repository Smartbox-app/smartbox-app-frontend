import React from 'react';

import './ButtonsContainer.scss';

interface Props {
  children: React.ReactNode;
  max?: boolean;
}

const ButtonsContainer = ({ max, children }: Props) => (
  <div className={`buttons-container ${max ? 'max' : ''}`}>{children}</div>
);

export default ButtonsContainer;
