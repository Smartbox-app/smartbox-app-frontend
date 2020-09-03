import React from 'react';

import './FormContainer.scss';

interface Props {
  children: React.ReactNode;
  max?: boolean;
  className?: string;
}

const FormContainer = ({ children, max, className }: Props) => (
  <div className={`form-container ${max ? 'max' : ''} ${className || ''}`}>{children}</div>
);

export default FormContainer;
