import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { auth } from '../../../actions';

import { MenuItemType } from '../../../types/menu-item';

import MenuItem from './MenuItem';
import LogoContainer from '../LogoContainer';

import './Navigation.scss';

interface Props {
  menuItems: MenuItemType[];
  logout: () => void;
}

const Navigation = ({ logout, menuItems }: Props) => {
  const basicItems: MenuItemType[] = [
    {
      icon: 'logout.svg',
      text: 'application.logout',
      onClick: logout,
      customClass: 'logout-button',
    },
  ];

  const menu = [...menuItems, ...basicItems].map((item: MenuItemType, index: number) => (
    <MenuItem
      key={item.text}
      address={item.address}
      icon={item.icon}
      text={item.text}
      badge={item.badge}
      onClick={item.onClick}
      customClass={item.customClass}
    />
  ));

  return (
    <div className="page-header-wrapper">
      <LogoContainer />
      <div className="navigation-wrapper">{menu}</div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Navigation);
