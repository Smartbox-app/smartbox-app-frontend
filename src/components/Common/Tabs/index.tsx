import React from 'react';
import { NavLink } from 'react-router-dom';

import './Tabs.scss';
import {__} from "../../../helpers/i18n";

interface Tab {
  to: string;
  text: string;
  className?: string;
  activeClassName?: string;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const displayTabs = tabs.map((tab: Tab, index: number) => (
    <NavLink
      key={index}
      exact
      className={`tab ${tab.className ? tab.className : ''}`}
      activeClassName={`active ${tab.activeClassName ? tab.activeClassName : ''}`}
      to={tab.to}
    >
      {__(tab.text)}
    </NavLink>
  ));
  return <div className="tabs">{displayTabs}</div>;
};

export default Tabs;
