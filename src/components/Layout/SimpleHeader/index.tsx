import React from 'react';

import './SimpleHeader.scss';
import {__} from "../../../helpers/i18n";

interface Props {
  title: string;
  noMargin?: boolean;
}

const SimpleHeader = ({ title, noMargin }: Props) => (
  <div className="simple-header-container">
    <div className="simple-header">
      <h3 className={`${noMargin ? 'no-margin' : ''}`}>{__(title)}</h3>
    </div>
  </div>
);

export default SimpleHeader;
