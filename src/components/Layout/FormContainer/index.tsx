import React from 'react';

import './FormContainer.scss';
import styled from 'styled-components';

const StyledFormContainer = styled.div`
  gap: 8px;
`;

interface Props {
  children: React.ReactNode;
  max?: boolean;
  className?: string;
  highlight?: boolean;
}

const FormContainer = ({ children, max, className, highlight }: Props) => (
  <StyledFormContainer
    className={`form-container ${max ? 'max' : ''} ${className || ''}`}
  >
    {children}
  </StyledFormContainer>
);

export default FormContainer;
