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
      <li className="single single-to-explain">
        <span>Do wyjaśnienia</span>
      </li>
      <li className="single single-to-check">
        <span>Do sprawdzenia</span>
      </li>
      <li className="single single-no-paid-extension">
        <span>Zaległości</span>
      </li>
    </ul>
  </div>
);

export default MapLegend;
