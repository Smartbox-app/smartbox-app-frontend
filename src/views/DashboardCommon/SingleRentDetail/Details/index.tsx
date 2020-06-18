import React from 'react';
import { RentStatus } from 'smartbox-types';
import { dateOnly } from '../../../../utils/format-date';

import Row from './Row';

interface Props {
  state?: RentStatus;
}

const Details = ({ state }: Props) => (
  <div>
    <Row label="Data rozpoczęcia" content={`${dateOnly(new Date())}`} />
    <Row label="Data zakończenia" content={`${dateOnly(new Date())}`} />
    <Row label="Nazwa placu" content="Warszawa, Mokotów" />
    <Row label="Rozmiar skrytki" content="3" />
    <Row label="Number skrytki" content="404" />
    <Row label="Status wynajmu" content="Wynajęty" />
  </div>
);

export default Details;
