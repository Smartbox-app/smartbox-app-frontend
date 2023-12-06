import React from 'react';

import './FormContainer.scss';
import styled from 'styled-components';

const StyledFormContainer = styled.div`
&.highlight {
  border-radius: 5px;
  border: 1px solid ${props => props.theme.colors.primary};
  position: relative;
  padding: 15px;
  margin: 10px 0;
}`

interface Props {
  children: React.ReactNode;
  max?: boolean;
  className?: string;
  highlight?: boolean;
}

const FormContainer = ({ children, max, className, highlight }: Props) => (
  <StyledFormContainer className={`form-container ${highlight ? 'highlight' : ''} ${max ? 'max' : ''} ${className || ''}`}>{children}</StyledFormContainer>
);

export default FormContainer;
