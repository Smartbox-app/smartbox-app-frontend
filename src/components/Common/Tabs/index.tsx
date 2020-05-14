import React from 'react';
import { NavLink } from 'react-router-dom';

import './Tabs.scss';

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
  const displayTabs = tabs.map((tab: Tab, index: any) => (
    <NavLink
      key={index}
      exact
      className={`tab ${tab.className ? tab.className : ''}`}
      activeClassName={`active ${tab.activeClassName ? tab.activeClassName : ''}`}
      to={tab.to}
    >
      {tab.text}
    </NavLink>
  ));
  return <div className="tabs">{displayTabs}</div>;
};

export default Tabs;
