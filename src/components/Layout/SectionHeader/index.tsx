import React from 'react';
import './SectionHeader.scss';
import { __ } from '../../../helpers/i18n';

interface Props {
  title: string;
  noMargin?: boolean;
}

const SectionHeader = ({ title, noMargin }: Props) => (
  <div className={`section-header-container ${noMargin ? 'no-margin' : ''}`}>
    <div className="section-header">
      <h3 className={`${noMargin ? 'no-margin' : ''}`}>{__(title)}</h3>
    </div>
  </div>
);

export default SectionHeader;
