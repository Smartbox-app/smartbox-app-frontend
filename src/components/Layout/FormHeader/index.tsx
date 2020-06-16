import React from 'react';

import './FormHeader.scss';

interface Props {
  title: string;
  noMargin?: boolean;
}

const FormHeader = ({ title, noMargin }: Props) => (
  <div className="form-header-container">
    <div className="form-header">
      <h3 className={`${noMargin ? 'no-margin' : ''}`}>{title}</h3>
    </div>
  </div>
);

export default FormHeader;
