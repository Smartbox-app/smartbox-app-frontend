import React from 'react';
import styled from 'styled-components';

import { __ } from "src/helpers/i18n";
import { useTenantNaming } from 'src/hooks/useTenantNaming';
import { colorOrDark } from 'src/utils/color';

import 'src/views/DashboardCommon/Welcome/OrdersHistory/History/Legend/Legend.scss';

const StyledActive = styled.p`
  background-color: ${({ theme }) => colorOrDark(theme.colors.primary)};
`

const Legend = () => {
  const {getText} = useTenantNaming();
  return (
  <div className="history-legend">
    <div className='single-legend-entry'>
      <StyledActive className="legend-color" />
      <p className="legend-desc">{getText('active_boxes')}</p>
      <span className="legend-color payment-issue" />
    </div>
    <div className='single-legend-entry'>
      <p className="legend-desc">{__('application.unfinishedProcess')}</p>
    </div>
    <div className='single-legend-entry'>
      <span className="legend-color ended" />
      <p className="legend-desc">{__('application.finished')}</p>
    </div>
  </div>
  );
}

export default Legend;
