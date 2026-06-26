import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import {
  BoxListRes,
  BoxMapRes,
  RentDetailsRes,
  RentStatus,
  StockRes,
} from 'smartbox-types';
import { connect, useDispatch } from 'react-redux';
import { boxes } from '../../../actions';
import { Row } from '../../../components/Common';
import { ApplicationState } from '../../../reducers';
import { dateOnly } from '../../../utils/format-date';
import { __ } from '../../../helpers/i18n';

import { Edit } from './Edit';

import './BoxDetail.scss';
import { useGetMyDetailsQuery } from '../../../queries';
import { Header, Link, Modal, Section, Typography } from 'src/components/ui';
import { EndRentPhoto } from 'src/components/Common/EndRentPhoto';

interface Props {
  singleBoxDetail: RentDetailsRes;
  box: BoxListRes | BoxMapRes;
  stockId: string;
  boxDataCleanUp: () => void;
  callback?: () => void;
}

const BoxDetail = ({
  boxDataCleanUp,
  box: { rentId, id, identifier, status, area },
  singleBoxDetail,
  stockId,
  callback,
}: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();

  useEffect(() => {
    if (rentId) dispatch(boxes.fetchSingleBoxDetails(rentId));

    return () => {
      boxDataCleanUp();
    };
  }, []);

  if (!user) return null;

  const isThisBoxFree = (data: string): boolean => data === '';
  const displayStatus = singleBoxDetail.status ?? status;

  return (
    <>
      <Modal.Header title={__('application.singleStoreDetail')} />
      <Modal.Content>
        <div className="detail-wrapper">
          <Row label="application.storeNumber" content={identifier} />
          <Row label="application.storeSize" content={`${area}m²`} />

          {rentId && status !== RentStatus.free && (
            <>
              <Row
                label="application.rentedBy"
                content={
                  singleBoxDetail.owner
                    ? `${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}`
                    : '---'
                }
              />
              <Row
                label="application.startDate"
                content={dateOnly(singleBoxDetail.startAt)}
              />
              <Row
                label="application.endDate"
                content={dateOnly(singleBoxDetail.finishAt)}
              />
              <Row
                label="application.phone"
                content={
                  singleBoxDetail?.owner?.phone ? (
                    <Link href={`tel:${singleBoxDetail.owner.phone}`}>
                      {singleBoxDetail.owner.phone}
                    </Link>
                  ) : (
                    '---'
                  )
                }
              />
              <Row
                label="application.mail"
                content={
                  isThisBoxFree(rentId) ? (
                    '---'
                  ) : (
                    <Link href={`mailto:${singleBoxDetail.owner?.email ?? ''}`}>
                      {singleBoxDetail.owner
                        ? singleBoxDetail.owner.email
                        : __('application.lack')}
                    </Link>
                  )
                }
              />
            </>
          )}

          <Row label="application.storeState" content={displayStatus} />

          {singleBoxDetail.endRentPhoto &&
          singleBoxDetail.status !== RentStatus.rented ? (
            <Section variant="bordered">
              <Header variant="h3">{__('application.endRentPhoto')}</Header>
              <Typography>{__('application.endRentPhotoShowFull')}</Typography>
              <EndRentPhoto rentId={rentId} />
            </Section>
          ) : null}

          <Edit
            display
            callback={callback}
            selectedBoxId={id}
            rentId={rentId}
            singleBoxDetailStatus={singleBoxDetail.status}
            stockId={stockId}
          />
        </div>
      </Modal.Content>
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  singleBoxDetail: state.boxes.singleBoxDetail,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators({ ...boxes }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BoxDetail);
