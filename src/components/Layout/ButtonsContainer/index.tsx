import React from 'react';

import './ButtonsContainer.scss';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  max?: boolean;
  className?: string;
  column?: boolean;
  spaceBetween?: boolean;
}

const StyledButtonsContainer = styled('div')(({theme}) => ({
  gap: theme.spacing * 4
}))

const ButtonsContainer = ({ max, children, column, spaceBetween, className }: Props) => (
  <StyledButtonsContainer
    className={`buttons-container ${max ? 'max' : ''} ${column ? 'column' : ''} ${
      spaceBetween ? 'space-between' : ''
    } ${className || ''}`}
  >
    {children}
  </StyledButtonsContainer>
);

export default ButtonsContainer;
