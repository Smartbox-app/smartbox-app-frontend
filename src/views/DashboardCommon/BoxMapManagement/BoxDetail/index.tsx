import React, { useState } from 'react';
import { RentDetailsRes, UserRes, UserRole } from 'smartbox-types';
import { connect } from 'react-redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { ApplicationState } from '../../../../reducers';
import { dateOnly } from '../../../../utils/format-date';
import { __ } from '../../../../helpers/i18n';

import Edit from './Edit';

import './BoxDetail.scss';

interface Props {
  singleBoxDetail: RentDetailsRes;
  selectedBoxId: string;
  rentId: string;
  user: UserRes;
}

const BoxDetail = ({ selectedBoxId, singleBoxDetail, rentId, user }: Props) => {
  const [optionDisplayState, optionDisplayToggle] = useState(false);

  const isThisBoxFree = (data: string): boolean => data === '';

  return (
    <div className="detail-wrapper">
      <SectionHeader title={__('application.singleStoreDetail')} />
      <p className="single">
        <span className="fa fa-lock" />
        <span>{__('application.storeNumber')}: </span>
        <strong>{selectedBoxId}</strong>
      </p>
      {user.role === UserRole.admin && (
        <>
          <p className="single">
            <span className="fa fa-user" />
            <span>{__('application.rentedBy')}: </span>
            <strong>
              {singleBoxDetail.owner ? `${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}` : '---'}
            </strong>
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
            <span className="fa fa-envelope" />
            <span>{__('application.mail')}:</span>
            <strong>
              {isThisBoxFree(rentId) ? (
                '---'
              ) : (
                <a
                  href={`mailto:${singleBoxDetail.owner ? singleBoxDetail.owner.email : 'error'}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {singleBoxDetail.owner ? singleBoxDetail.owner.email : 'brak'}
                </a>
              )}
            </strong>
          </p>
        </>
      )}

      <ButtonsContainer max>
        <Button
          className={`custome-icon-button ${!optionDisplayState ? '' : 'rotate'}`}
          primary
          text={!optionDisplayState ? __('application.showEditOptions') : __('application.hideEditOptions')}
          click={() => optionDisplayToggle(!optionDisplayState)}
          icon="arrow-down-white.svg"
        />
      </ButtonsContainer>
      {optionDisplayState && <Edit selectedBoxId={selectedBoxId} rentId={rentId} />}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleBoxDetail: state.boxes.singleBoxDetail,
  user: state.user.details,
});

export default connect(mapStateToProps)(BoxDetail);
