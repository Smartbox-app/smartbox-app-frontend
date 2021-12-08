import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { RentDetailsRes, UserRes } from 'smartbox-types';
import { connect } from 'react-redux';
import { boxes } from '../../../../actions';
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
  boxDataCleanUp: () => void;
}

const BoxDetail = ({ boxDataCleanUp, selectedBoxId, singleBoxDetail, rentId, user }: Props) => {
  const [optionDisplayState, optionDisplayToggle] = useState(false);

  useEffect(() => {
    return () => {
      boxDataCleanUp();
    };
  }, []);

  const isThisBoxFree = (data: string): boolean => data === '';

  return (
    <div className="detail-wrapper">
      <SectionHeader title='application.singleStoreDetail' />

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

          <DescriptionRow icon="fa-mobile" text={__('application.phone')}>
            {singleBoxDetail?.owner?.phone ? (
              <a href={`tel:${singleBoxDetail.owner.phone}`}>{singleBoxDetail.owner.phone}</a>
            ) : (
              '---'
            )}
          </DescriptionRow>

          <DescriptionRow icon="fa-envelope" text={__('application.mail')}>
            {isThisBoxFree(rentId) ? (
              '---'
            ) : (
              <a
                href={`mailto:${singleBoxDetail.owner?.email ? singleBoxDetail.owner?.email : 'error'}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                {singleBoxDetail.owner ? singleBoxDetail.owner.email : __('application.lack')}
              </a>
            )}
          </DescriptionRow>
        </>
      )}
      <Edit display selectedBoxId={selectedBoxId} rentId={rentId} singleBoxDetailStatus={singleBoxDetail.status} />
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleBoxDetail: state.boxes.singleBoxDetail,
  user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({ ...boxes }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BoxDetail);
