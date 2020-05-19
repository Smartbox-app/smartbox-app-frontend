import React, { useState } from 'react';
import { RentStatus } from 'smartbox-types';
import Edit from './Edit';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';

import './BoxDetail.scss';

interface Props {
  selectedBoxId: number | string;
}

const BoxDetail = ({ selectedBoxId }: Props) => {
  const [optionDisplayState, optionDisplayToogle] = useState(false);

  return (
    <div className="detail-wrapper">
      <SectionHeader title="Szczegóły wybranej skrytki:" />
      <p className="single">
        <span className="fa fa-lock" />
        Numer skrytki: <strong>{selectedBoxId}</strong>
      </p>
      <p className="single">
        <span className="fa fa-user" />
        Wynajęte przez: <strong>Jan Kowalski</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        Termin wynajęcia: <strong>20.03.2020</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        Termin zwrotu: <strong>20.09.2020</strong>
      </p>
      <p className="single">
        <span className="fa fa-arrow-right" />
        Status: <strong>{RentStatus.rented}</strong>
      </p>
      <ButtonsContainer>
        <Button
          primary
          text={!optionDisplayState ? 'Pokaż opcję edycji' : 'Ukryj opcje edycji'}
          click={() => optionDisplayToogle(!optionDisplayState)}
        />
      </ButtonsContainer>
      {optionDisplayState && <Edit selectedBoxId={selectedBoxId} />}
    </div>
  );
};

export default BoxDetail;
