import React, { useState } from 'react';
import { RentDetailsRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';

import Edit from './Edit';

import './BoxDetail.scss';
import { dateOnly } from '../../../../utils/format-date';

interface Props {
  singleBoxDetail: RentDetailsRes;
  selectedBoxId: number | string;
}

const BoxDetail = ({ selectedBoxId, singleBoxDetail }: Props) => {
  const [optionDisplayState, optionDisplayToogle] = useState(false);
  const dummyMail = 'kontakt@itdotfocus.com';
  const dummyPhone = 333222111;

  return (
    <div className="detail-wrapper">
      <SectionHeader title="Szczegóły wybranej skrytki:" />
      <p className="single">
        <span className="fa fa-lock" />
        Numer skrytki: <strong>{`${singleBoxDetail.number}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-user" />
        Wynajęte przez: <strong>{`${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        Termin wynajęcia: <strong>{`${dateOnly(singleBoxDetail.startAt)}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        Termin zwrotu: <strong>{`${dateOnly(singleBoxDetail.finishAt)}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-arrow-right" />
        Status: <strong>{`${singleBoxDetail.status}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-phone" />
        Telefon:{' '}
        <strong>
          <a href={`tel:${dummyPhone}`} rel="noopener noreferrer" target="_blank">
            {dummyPhone}
          </a>
        </strong>
      </p>
      <p className="single">
        <span className="fa fa-envelope" />
        Mail:{' '}
        <strong>
          <a href={`mailto:${dummyMail}`} rel="noopener noreferrer" target="_blank">
            {dummyMail}
          </a>
        </strong>
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

const mapStateToProps = (state: any) => ({
  singleBoxDetail: state.boxes.singleBoxDetail,
});

export default connect(mapStateToProps)(BoxDetail);
