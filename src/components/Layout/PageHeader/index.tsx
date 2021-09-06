import React from 'react';
import './PageHeader.scss';

interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => (
  <div className="page-header-container">
    <div className="page-header">
      <h2>{title}</h2>
    </div>
  </div>
);

export default PageHeader;
