import React from 'react';
import './PageHeader.scss';

interface Props {
  title: string;
}

const PageHeader = ({ title }: Props) => (
  <div className="page-header-container">
    <div className="page-header">
      <h1>{title}</h1>
    </div>
  </div>
);

export default PageHeader;
