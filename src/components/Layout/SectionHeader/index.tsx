import React from 'react';
import './SectionHeader.scss';

interface Props {
  title: string;
  noMargin?: boolean;
}

const SectionHeader = ({ title, noMargin }: Props) => (
  <div className="section-header-container">
    <div className="section-header">
      <h2 className={`${noMargin ? 'no-margin' : ''}`}>{title}</h2>
    </div>
  </div>
);

export default SectionHeader;
