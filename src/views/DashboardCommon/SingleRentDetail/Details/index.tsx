import React from 'react';
import { MyRentList } from 'smartbox-types';
import { dateOnly } from '../../../../utils/format-date';
import { __ } from '../../../../helpers/i18n';

import Row from './Row';

interface Props {
  singleRent: MyRentList;
}

const Details = ({ singleRent }: Props) => (
  <div>
    <Row label={__('application.startDate')} content={`${dateOnly(singleRent ? singleRent.startAt : new Date())}`} />
    <Row label={__('application.endDate')} content={`${dateOnly(singleRent ? singleRent.finishAt : new Date())}`} />
    <Row label={__('application.storePlaceName')} content={singleRent.stockName || `${__('application.lack')}`} />
    <Row label={__('application.storeSize')} content={singleRent.size || `${__('application.lack')}`} />
    <Row label={__('application.storeNumber')} content={singleRent.number || `${__('application.lack')}`} />
    <Row label={__('application.storeState')} content={singleRent.status || `${__('application.lack')}`} />
  </div>
);

export default Details;
