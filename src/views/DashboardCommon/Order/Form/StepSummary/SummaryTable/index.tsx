import React from 'react';
import { formatPrice } from '../../../../../../utils/format-price';
import { dateOnly } from '../../../../../../utils/format-date';

import './SummaryTable.scss';

interface Props {
  dateStart: Date;
  dateEnd: Date;
  countedPrice: number;
}

const SummaryTable = ({ dateStart, dateEnd, countedPrice }: Props) => (
  <div className="order-summary-wrapper">
    <div className="row">
      <div className="cell">Termin rozpoczęcia:</div>
      <div className="cell fat">
        <span>{dateOnly(dateStart)}</span>
      </div>
    </div>
    <div className="row">
      <div className="cell">Termin zakończenia:</div>
      <div className="cell fat">
        <span>{dateOnly(dateEnd)}</span>
      </div>
    </div>
    <div className="row">
      <div className="cell">Opłata za wynajem:</div>
      <div className="cell fat">
        <span>{formatPrice(countedPrice)}</span>
      </div>
    </div>
  </div>
);

export default SummaryTable;
