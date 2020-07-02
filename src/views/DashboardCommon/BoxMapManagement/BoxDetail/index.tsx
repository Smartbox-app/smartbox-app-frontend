import React, { useState } from 'react';
import { RentDetailsRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { ButtonsContainer, SectionHeader } from '../../../../../components/Layout';
import { Button } from '../../../../../components/Common';
import { dateOnly } from '../../../../../utils/format-date';
import { __ } from '../../../../../helpers/i18n';

import Edit from './Edit';

import './BoxDetail.scss';

interface Props {
  singleBoxDetail: RentDetailsRes;
  selectedBoxId: string;
  rentId: string;
}

const BoxDetail = ({ selectedBoxId, singleBoxDetail, rentId }: Props) => {
  const [optionDisplayState, optionDisplayToogle] = useState(false);
  const dummyMail = 'kontakt@itdotfocus.com';
  const dummyPhone = 333222111;
  const isThisBoxFree = (data: string): boolean => data === '';

  return (
    <div className="detail-wrapper">
      <SectionHeader title={__('application.singleStoreDetail')} />
      <p className="single">
        <span className="fa fa-lock" />
        <span>{__('application.storeNumber')}: </span>
        <strong>{selectedBoxId}</strong>
      </p>
      <p className="single">
        <span className="fa fa-user" />
        <span>{__('application.rentedBy')}: </span>
        <strong>{`${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        <span>{__('application.startDate')}: </span>
        <strong>{`${isThisBoxFree(rentId) ? '---' : dateOnly(singleBoxDetail.startAt)}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-calendar " />
        <span>{__('application.endDate')}: </span>
        <strong>{`${isThisBoxFree(rentId) ? '---' : dateOnly(singleBoxDetail.finishAt)}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-arrow-right" />
        <span>{__('application.storeState')}: </span>
        <strong>{`${singleBoxDetail.status}`}</strong>
      </p>
      <p className="single">
        <span className="fa fa-phone" />
        <span>{__('application.phone')}:</span>
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
        <span>{__('application.mail')}:</span>
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
          text={!optionDisplayState ? __('application.showEditOptions') : __('application.hideEditOptions')}
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
