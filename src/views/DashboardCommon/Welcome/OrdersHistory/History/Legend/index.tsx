import React from 'react';

import './Legend.scss';

const Legend = () => (
  <div className="history-legend">
    <span className="legend-color active-stock" />
    <p className="legend-desc">Aktywne mini magazyny</p>
    <span className="legend-color payment-issue" />
    <p className="legend-desc">Niedokończony proces</p>
    <span className="legend-color ended" />
    <p className="legend-desc">Zakończone</p>
  </div>
);

export default Legend;
