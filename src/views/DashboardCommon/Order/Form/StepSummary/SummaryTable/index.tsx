import React from 'react';
import { formatPrice } from '../../../../../../utils/format-price';
import { dateOnly } from '../../../../../../utils/format-date';

import './SummaryTable.scss';
import {__} from "../../../../../../helpers/i18n";

interface Props {
  dateStart: Date;
  dateEnd: Date;
  countedPrice: number;
}

const SummaryTable = ({ dateStart, dateEnd, countedPrice }: Props) => (
  <div className="order-summary-wrapper">
    <div className="row">
      <div className="cell">{__('application.startTerm')}</div>
      <div className="cell fat">
        <span>{dateOnly(dateStart)}</span>
      </div>
    </div>
    <div className="row">
      <div className="cell">{__('application.finishTerm')}</div>
      <div className="cell fat">
        <span>{dateOnly(dateEnd)}</span>
      </div>
    </div>
    <div className="row">
      <div className="cell">{__('application.paymentForRent')}</div>
      <div className="cell fat">
        <span>{formatPrice(countedPrice)}</span>
      </div>
    </div>
  </div>
);

export default SummaryTable;
