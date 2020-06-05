import React from 'react';

import './MapLegend.scss';

const MapLegend = () => (
  <div className="map-legend-wrapper">
    <ul className="legend-list">
      <li className="single single-free">
        <span>Wolne</span>
      </li>
      <li className="single single-reserved">
        <span>Zajęty</span>
      </li>
      <li className="single single-toExplain">
        <span>Do wyjaśnienia</span>
      </li>
      <li className="single single-toCheck">
        <span>Do sprawdzenia</span>
      </li>
      <li className="single single-noPaidExtension">
        <span>Zaległości</span>
      </li>
    </ul>
  </div>
);

export default MapLegend;
