import React from 'react';
import { ReactSVG } from 'react-svg';

import './Icon.scss';

interface Props {
  icon: string;
  noWrapper?: boolean;
  light?: boolean;
  transparent?: boolean;
  className?: string;
}

const Icon = ({ icon, className, noWrapper, transparent, light }: Props) => (
  <div
    className={`icon-wrapper ${className || ''} ${noWrapper ? 'no-wrapper' : ''} ${light ? 'light' : ''} ${
      transparent ? 'transparent' : ''
    }`}
  >
    <div className="icon">
      <ReactSVG src={`/assets/icons/${icon}.svg`} />
    </div>
  </div>
);

export default Icon;
