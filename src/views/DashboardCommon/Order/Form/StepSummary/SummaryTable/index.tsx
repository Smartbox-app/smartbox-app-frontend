import React from 'react';
import './SummaryTable.scss';
import { formatPrice } from '../../../../../../utils/format-price';

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
        <span>{dateStart.toLocaleDateString()}</span>
      </div>
    </div>
    <div className="row">
      <div className="cell">Termin zakończenia:</div>
      <div className="cell fat">
        <span>{dateEnd.toLocaleDateString()}</span>
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
