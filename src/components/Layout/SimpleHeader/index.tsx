import React from 'react';

import {__} from "src/helpers/i18n";

import './SimpleHeader.scss';

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
