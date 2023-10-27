import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import { __ } from "../../../../../helpers/i18n";
import styled, { css } from 'styled-components';
import { lighten } from 'polished';

interface Props {
    text: string;

    address: string | undefined;
    fullIconLink: string;
    handleItemClick: () => void;

    badge?: boolean;
    icon?: string | null;
}

const linkStyles = css`
&:hover {
    border-color: ${props => props.theme.colors.primary};
    color: ${props => lighten(0.1, props.theme.colors.primary)};
}

&.active {
    border-color: ${props => props.theme.colors.primary};
  
    .main-menu-item_text {
      color: ${props => props.theme.colors.primary};
    }
  }

  &.active .main-menu-item_logo {
    fill: ${props => props.theme.colors.primary};
  }

  &:hover .main-menu-item_logo {
    fill: ${props => lighten(0.1, props.theme.colors.primary)};
  }
`

const StyledNavLink = styled(NavLink)`${linkStyles}`;
const StyledA = styled.a`${linkStyles}`;

const CustomNavLink = ({ address, text, badge, fullIconLink, icon, handleItemClick }: Props) => {
    if (address) {
        return (
            <StyledNavLink to={address} title={__(text)} className='main-menu-item' activeClassName="active" onClick={handleItemClick}>
                {badge && <span className="menu-item-badge fa fa-exclamation-circle" />}
                {icon !== null && <ReactSVG src={fullIconLink} className="main-menu-item_logo menu-icon" />}
                <span className="main-menu-item_text">{__(text)}</span>
            </StyledNavLink>
        );
    } else {
        return (
            <StyledA role="button" tabIndex={0} title={__(text)} className='main-menu-item' onClick={handleItemClick}>
                {badge && <span className="menu-item-badge fa fa-exclamation-circle" />}
                {icon !== null && <ReactSVG src={fullIconLink} className="main-menu-item_logo menu-icon" />}
                <span className="main-menu-item_text">{__(text)}</span>
            </StyledA>
        );
    }
};

export default CustomNavLink;
