import React from 'react';
import { Logo } from '../../Branded';

import './MobileLogoContainer.scss';

interface Props {
    small?: boolean;
    onlyBottomMargin?: boolean;
    className?: string;
}

const MobileLogoContainer = ({ small, onlyBottomMargin, className }: Props): any => (
    <div
        className={`mobile-logo-container ${className || ''} ${small ? 'small' : ''} ${onlyBottomMargin ? 'only-bottom-margin' : ''
            }`}
    >
        <Logo />
    </div>
);

export default MobileLogoContainer;
