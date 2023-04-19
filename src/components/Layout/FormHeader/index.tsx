import React from 'react';

import './FormHeader.scss';
import {__} from "../../../helpers/i18n";

interface Props {
  title: string;
  noMargin?: boolean;
}

const FormHeader = ({ title, noMargin }: Props) => (
  <div className="form-header-container">
    <div className="form-header">
      <h2 className={`${noMargin ? 'no-margin' : ''}`}>{__(title)}</h2>
    </div>
  </div>
);

export default FormHeader;
