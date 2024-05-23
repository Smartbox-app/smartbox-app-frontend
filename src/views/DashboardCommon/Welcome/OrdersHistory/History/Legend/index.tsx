import React from 'react';

import './Legend.scss';
import {__} from "../../../../../../helpers/i18n";
import styled from 'styled-components';

const StyledActive = styled.p`
  color: ${({theme}) => theme.colors.primary};
`

const Legend = () => (
  <div className="history-legend">
    <StyledActive className="legend-color" />
    <p className="legend-desc">{__('application.activeStores')}</p>
    <span className="legend-color payment-issue" />
    <p className="legend-desc">{__('application.unfinishedProcess')}</p>
    <span className="legend-color ended" />
    <p className="legend-desc">{__('application.finished')}</p>
  </div>
);

export default Legend;
