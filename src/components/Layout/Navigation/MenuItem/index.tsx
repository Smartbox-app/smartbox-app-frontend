import React from 'react';
import { MenuItemType } from '../../../../types/menu-item';

import './MenuItem.scss';
import CustomNavLink from './CustomNavLink';

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

    return (
      <CustomNavLink
        text={text}
        address={address}
        fullIconLink={fullIconLink}
        handleItemClick={this.handleItemClick}
        badge={badge}
        icon={icon}
      />
    );
  }
}

export default MenuItem;
