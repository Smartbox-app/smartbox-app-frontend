import React from 'react';
import './PageHeader.scss';
import {__} from "../../../helpers/i18n";

interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => (
  <div className="page-header-container">
    <div className="page-header">
      <h2>{__(title)}</h2>
    </div>
  </div>
);

export default PageHeader;
