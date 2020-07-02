import React from 'react';

import './MapLegend.scss';
import { __ } from '../../../../../helpers/i18n';

const MapLegend = () => (
  <div className="map-legend-wrapper">
    <ul className="legend-list">
      <li className="single single-free">
        <span>{__('application.free')}</span>
      </li>
      <li className="single single-reserved">
        <span>{__('application.rented')}</span>
      </li>
      <li className="single single-to-explain">
        <span>{__('application.toExplain')}</span>
      </li>
      <li className="single single-to-check">
        <span>{__('application.toCheck')}</span>
      </li>
      <li className="single single-no-paid-extension">
        <span>{__('application.debt')}</span>
      </li>
    </ul>
  </div>
);

export default MapLegend;
