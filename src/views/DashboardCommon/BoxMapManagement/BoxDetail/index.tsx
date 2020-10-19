import React, { useState } from 'react';
import { RentDetailsRes, UserRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { ButtonsContainer, SectionHeader } from '../../../../components/Layout';
import { Button } from '../../../../components/Common';
import { ApplicationState } from '../../../../reducers';
import { dateOnly } from '../../../../utils/format-date';
import { __ } from '../../../../helpers/i18n';
import { isAdmin } from '../../../../utils/role-check';

import DescriptionRow from './DescriptionRow';
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

      <DescriptionRow icon="fa-lock" text={__('application.storeNumber')}>
        {selectedBoxId}
      </DescriptionRow>

      {isAdmin(user.role) && (
        <>
          <DescriptionRow icon="fa-user" text={__('application.rentedBy')}>
            {singleBoxDetail.owner ? `${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}` : '---'}
          </DescriptionRow>

          <DescriptionRow icon="fa-calendar" text={__('application.startDate')}>
            {`${isThisBoxFree(rentId) ? '---' : dateOnly(singleBoxDetail.startAt)}`}
          </DescriptionRow>

          <DescriptionRow icon="fa-calendar" text={__('application.endDate')}>
            {`${isThisBoxFree(rentId) ? '---' : dateOnly(singleBoxDetail.finishAt)}`}
          </DescriptionRow>

          <DescriptionRow icon="fa-arrow-right" text={__('application.storeState')}>
            {`${singleBoxDetail.status}`}
          </DescriptionRow>

          <DescriptionRow icon="fa-flag" text="Płatność">
            {singleBoxDetail.owner ? `Opłacono ze zniżką` : '---'}
          </DescriptionRow>

          <DescriptionRow icon="fa-envelope" text={__('application.mail')}>
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
          </DescriptionRow>
        </>
      )}

      <ButtonsContainer max>
        <Button
          className={`custom-icon-button ${!optionDisplayState ? '' : 'rotate'}`}
          primary
          text={!optionDisplayState ? __('application.showEditOptions') : __('application.hideEditOptions')}
          click={() => optionDisplayToggle(!optionDisplayState)}
          icon="arrow-down-white.svg"
        />
      </ButtonsContainer>
      {optionDisplayState && (
        <Edit selectedBoxId={selectedBoxId} rentId={rentId} singleBoxDetailStatus={singleBoxDetail.status} />
      )}
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleBoxDetail: state.boxes.singleBoxDetail,
  user: state.user.details,
});

export default connect(mapStateToProps)(BoxDetail);
