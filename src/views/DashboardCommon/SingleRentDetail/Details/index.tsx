import React from 'react';
import { MyRentList } from 'smartbox-types';
import { dateOnly } from '../../../../utils/format-date';

import Row from './Row';

interface Props {
  singleRent: MyRentList;
}

const Details = ({ singleRent }: Props) => (
  <div>
    <Row label="Data rozpoczęcia" content={`${dateOnly(singleRent ? singleRent.startAt : new Date())}`} />
    <Row label="Data zakończenia" content={`${dateOnly(singleRent ? singleRent.finishAt : new Date())}`} />
    <Row label="Nazwa placu" content={singleRent.stockName || 'Brak'} />
    <Row label="Rozmiar skrytki" content={singleRent.size || 'Brak'} />
    <Row label="Number skrytki" content={singleRent.number || 'Brak'} />
    <Row label="Status wynajmu" content={singleRent.status || 'Brak'} />
  </div>
);

export default Details;
