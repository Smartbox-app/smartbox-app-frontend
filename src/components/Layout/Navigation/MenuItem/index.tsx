import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { MenuItemType } from '../../../../types/menu-item';

import './MenuItem.scss';

type Props = MenuItemType;

class MenuItem extends React.Component<Props> {
  private handleItemClick = (): void => {
    const { onClick } = this.props;
    if (typeof onClick === 'function') onClick();
    else {
      setTimeout(() => {
        const offset = (document.querySelector('#root') as any).offsetTop;
        window.scrollTo({
          top: offset,
          behavior: 'smooth',
        });
      });
    }
  };

  render(): any {
    const { address, icon, text, badge, customClass } = this.props;
    const fullIconLink = `/assets/icons/${icon}`;
    const itemClass = `main-menu-item ${!icon ? 'sub-menu-item' : ''} ${customClass || ''}`;
    if (address) {
      return (
        <NavLink
          to={address}
          title={text}
          className={itemClass}
          activeClassName="active"
          onClick={this.handleItemClick}
        >
          {badge && <span className="menu-item-badge fa fa-exclamation-circle" />}
          {icon !== null && <ReactSVG src={fullIconLink} className="main-menu-item_logo menu-icon" />}
          <span className="main-menu-item_text">{text}</span>
        </NavLink>
      );
    } else {
      return (
        <a role="button" tabIndex={0} title={text} className={itemClass} onClick={this.handleItemClick}>
          {badge && <span className="menu-item-badge fa fa-exclamation-circle" />}
          {icon !== null && <ReactSVG src={fullIconLink} className="main-menu-item_logo menu-icon" />}
          <span className="main-menu-item_text">{text}</span>
        </a>
      );
    }
  }
}

const mapStateToProps = (state: any): any => ({
  mainMenuShow: state.navigation,
});

export default connect(mapStateToProps)(MenuItem);
