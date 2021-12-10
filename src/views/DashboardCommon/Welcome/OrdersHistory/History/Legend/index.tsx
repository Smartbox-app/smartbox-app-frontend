import React from 'react';

import './Legend.scss';
import {__} from "../../../../../../helpers/i18n";

const Legend = () => (
  <div className="history-legend">
    <span className="legend-color active-stock" />
    <p className="legend-desc">{__('application.activeStores')}</p>
    <span className="legend-color payment-issue" />
    <p className="legend-desc">{__('application.unfinishedProcess')}</p>
    <span className="legend-color ended" />
    <p className="legend-desc">{__('application.finished')}</p>
  </div>
);

export default Legend;
