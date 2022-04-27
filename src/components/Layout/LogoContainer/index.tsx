import React from 'react';
import Logo from '../../Common/Logo';

import './LogoContainer.scss';

interface Props {
  small?: boolean;
  onlyBottomMargin?: boolean;
  className?: string;
}

const LogoContainer = ({ small, onlyBottomMargin, className }: Props): any => (
  <div
    className={`logo-container ${className || ''} ${small ? 'small' : ''} ${
      onlyBottomMargin ? 'only-bottom-margin' : ''
    }`}
  >
    <h1 className="hidden">Smartbox</h1>
    <Logo />
  </div>
);

export default LogoContainer;
