import React from 'react';
import { NavLink } from 'react-router-dom';
import { __ } from "../../../helpers/i18n";

import './Tabs.scss';
import styled from 'styled-components';
import { grayscale, lighten } from 'polished';
import { getColorForBackground } from '../../../utils/color';

interface Tab {
    to: string;
    text: string;
}

interface TabsProps {
    tabs: Tab[];
}

const StyledTab = styled(NavLink)`
    border-bottom: 2px solid ${props => grayscale(lighten(0.5, props.theme.colors.primary))};

    &.active {
        background: ${props => props.theme.colors.primary};
        color: ${props => getColorForBackground(props.theme.colors.primary)};
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }
    
    &:hover {
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }
`

const Tabs = ({ tabs }: TabsProps) => {
    const displayTabs = tabs.map((tab: Tab, index: number) => (
        <StyledTab
            key={index}
            exact={false}
            className="tab"
            activeClassName="active"
            to={tab.to}
        >
            {__(tab.text)}
        </StyledTab>
    ));
    return <div className="tabs">{displayTabs}</div>;
};

export { Tabs };
