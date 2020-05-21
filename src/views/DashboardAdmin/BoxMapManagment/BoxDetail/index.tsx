import React, { useState } from 'react';
import { RentDetailsRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { dateOnly } from '../../../../utils/format-date';

import Edit from './Edit';

import './BoxDetail.scss';

interface Props {
  singleBoxDetail: RentDetailsRes;
  selectedBoxId: number | string;
  rentId: string;
}

const BoxDetail = ({ selectedBoxId, singleBoxDetail, rentId }: Props) => {
  const [optionDisplayState, optionDisplayToogle] = useState(false);
  const dummyMail = 'kontakt@itdotfocus.com';
  const dummyPhone = 333222111;
  const isThisBoxFree = (data: string): boolean => data === '';

  console.log('asdasdad', isThisBoxFree(rentId));
  return (
    <div className="detail-wrapper">
      <SectionHeader title="Szczegóły wybranej skrytki:" />
      <p className="single">
        <span className="fa fa-lock" />
        Numer skrytki: <strong>{selectedBoxId}</strong>
      </p>
      <p className="single">
        <span className="fa fa-user" />
        Wynajęte przez: <strong>{`${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        Termin wynajęcia: <strong>{`${isThisBoxFree(rentId) ? '---' : dateOnly(singleBoxDetail.startAt)}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        Termin zwrotu: <strong>{`${isThisBoxFree(rentId) ? '---' : dateOnly(singleBoxDetail.finishAt)}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-arrow-right" />
        Status: <strong>{`${singleBoxDetail.status}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-phone" />
        Telefon:{' '}
        <strong>
          {isThisBoxFree(rentId) ? (
            '---'
          ) : (
            <a href={`tel:${dummyPhone}`} rel="noopener noreferrer" target="_blank">
              {dummyPhone}
            </a>
          )}
        </strong>
      </p>
      <p className="single">
        <span className="fa fa-envelope" />
        Mail:{' '}
        <strong>
          {isThisBoxFree(rentId) ? (
            '---'
          ) : (
            <a href={`mailto:${dummyMail}`} rel="noopener noreferrer" target="_blank">
              {dummyMail}
            </a>
          )}
        </strong>
      </p>
      <ButtonsContainer max>
        <Button
          className={`custome-icon-button ${!optionDisplayState ? '' : 'rotate'}`}
          primary
          text={!optionDisplayState ? 'Pokaż opcje edycji' : 'Ukryj opcje edycji'}
          click={() => optionDisplayToogle(!optionDisplayState)}
          icon="arrow-down-white.svg"
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
