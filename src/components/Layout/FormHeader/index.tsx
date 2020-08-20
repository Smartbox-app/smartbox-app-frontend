import React from 'react';

import './FormHeader.scss';

interface Props {
  title: string;
  noMargin?: boolean;
}

const FormHeader = ({ title, noMargin }: Props) => (
  <div className="form-header-container">
    <div className="form-header">
      <h4 className={`${noMargin ? 'no-margin' : ''}`}>{title}</h4>
    </div>
  </div>
);

export default FormHeader;
