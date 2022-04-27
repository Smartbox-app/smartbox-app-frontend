import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactSVG } from 'react-svg';
import {__} from "../../../../../helpers/i18n";

interface Props {
  text: string;
  itemClass: string;
  address: string | undefined;
  fullIconLink: string;
  handleItemClick: () => void;

  badge?: boolean;
  icon?: string | null;
}

const CustomNavLink = ({ address, itemClass, text, badge, fullIconLink, icon, handleItemClick }: Props) => {
  if (address) {
    return (
      <NavLink to={address} title={__(text)} className={itemClass} activeClassName="active" onClick={handleItemClick}>
        {badge && <span className="menu-item-badge fa fa-exclamation-circle" />}
        {icon !== null && <ReactSVG src={fullIconLink} className="main-menu-item_logo menu-icon" />}
        <span className="main-menu-item_text">{__(text)}</span>
      </NavLink>
    );
  } else {
    return (
      <a role="button" tabIndex={0} title={__(text)} className={itemClass} onClick={handleItemClick}>
        {badge && <span className="menu-item-badge fa fa-exclamation-circle" />}
        {icon !== null && <ReactSVG src={fullIconLink} className="main-menu-item_logo menu-icon" />}
        <span className="main-menu-item_text">{__(text)}</span>
      </a>
    );
  }
};

export default CustomNavLink;
