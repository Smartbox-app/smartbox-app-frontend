import React from 'react';

import './Legend.scss';
import { __ } from "../../../../../../helpers/i18n";
import styled from 'styled-components';
import { colorOrDark } from '../../../../../../utils/color';
import { useTenantNaming } from 'src/hooks/useTenantNaming';

const StyledActive = styled.p`
  background-color: ${({ theme }) => colorOrDark(theme.colors.primary)};
`

const Legend = () => {
  const {getText} = useTenantNaming();
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
}

export default Legend;
