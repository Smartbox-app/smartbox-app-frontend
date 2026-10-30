import React from 'react';

import { Logo } from 'src/components/Branded';
import { useTenant } from 'src/hooks/useTenant';

import './LogoContainer.scss';

interface Props {
    small?: boolean;
    onlyBottomMargin?: boolean;
    className?: string;
}

const LogoContainer = ({ small, onlyBottomMargin, className }: Props) => {
    const { tenant } = useTenant();

    if (!tenant) return null;

    return <div
        className={`logo-container ${className || ''} ${small ? 'small' : ''} ${onlyBottomMargin ? 'only-bottom-margin' : ''
            }`}
    >
        <h1 className="hidden">{tenant.name}</h1>
        <Logo />
    </div>
}

export { LogoContainer };
