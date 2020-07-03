import React from 'react';
import { __ } from '../../../../../helpers/i18n';

import './Row.scss';

interface Props {
  label: string;
  content: string | number;
}

const index = ({ label, content }: Props) => (
  <div className="row">
    <p className="row-label">{label}:</p>
    <strong className="row-content">{content || `${__('application.lackOfHistory')}`}</strong>
  </div>
);

export default index;
