import React from 'react';

import { Logo } from 'src/components/Branded';

import './MobileLogoContainer.scss';

interface Props {
  small?: boolean;
  onlyBottomMargin?: boolean;
  className?: string;
}

const MobileLogoContainer = ({
  small,
  onlyBottomMargin,
  className,
}: Props) => (
  <div
    className={`mobile-logo-container ${className || ''} ${small ? 'small' : ''} ${
      onlyBottomMargin ? 'only-bottom-margin' : ''
    }`}
  >
    <Logo width="medium" />
  </div>
);

export default MobileLogoContainer;
