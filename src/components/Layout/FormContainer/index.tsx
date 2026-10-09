import React from 'react';

import './FormContainer.scss';
import styled from 'styled-components';

const StyledFormContainer = styled.div<{ $fullWidth?: boolean }>`
  gap: 8px;
    max-width: ${({ $fullWidth }) => ($fullWidth ? '100%' : '600px')};
`;

interface Props {
  children: React.ReactNode;
  max?: boolean;
  className?: string;
  highlight?: boolean;
  fullWidth?: boolean;
}

const FormContainer = ({ children, max, className, fullWidth }: Props) => (
  <StyledFormContainer
    $fullWidth={fullWidth}
    className={`form-container ${max ? 'max' : ''} ${className || ''}`}
  >
    {children}
  </StyledFormContainer>
);

export default FormContainer;
