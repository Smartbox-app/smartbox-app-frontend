import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MenuItem from './MenuItem';
import { MenuItemType } from '../../../types/menuItem';
import { auth } from '../../../actions';

import './Navigation.scss';

interface Props {
  menuItems: MenuItemType[];
  logout: () => void;
}

class Navigation extends Component<Props> {
  private basicItems: MenuItemType[] = [
    {
      icon: '/assets/icons/iconmonstr-log-out-16.svg',
      text: 'Wyloguj',
      onClick: () => this.props.logout(),
      customClass: 'logout-button',
    },
  ];

  private menu = [...this.props.menuItems, ...this.basicItems].map((item: MenuItemType, index: number) => (
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

  render() {
    return <div className="navigation-wrapper">{this.menu}</div>;
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...auth,
    },
    dispatch,
  );

export default connect(null, mapDispatchToProps)(Navigation);
