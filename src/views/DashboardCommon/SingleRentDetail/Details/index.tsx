import React from 'react';
import { MyRentList } from 'smartbox-types';
import { dateOnly } from '../../../../utils/format-date';
import { __ } from '../../../../helpers/i18n';
import { Row } from '../../../../components/Common';

import './Details.scss';

interface Props {
  singleRent: MyRentList;
}

const Details = ({ singleRent }: Props) => (
  <div className="details-wrapper">
    <Row label="application.startDate" content={`${dateOnly(singleRent ? singleRent.startAt : new Date())}`} />
    <Row label="application.endDate" content={`${dateOnly(singleRent ? singleRent.finishAt : new Date())}`} />
    <Row label="application.storePlaceName" content={singleRent.stockName || __('application.lack')} />
    <Row
      label="application.storeSize"
      content={<div className="size">{singleRent.size} m</div> || __('application.lack')}
    />
    <Row label="application.storeNumber" content={singleRent.number || __('application.lack')} />
    <Row label="application.storeState" content={singleRent.status || __('application.lack')} />
  </div>
);

export default Details;
