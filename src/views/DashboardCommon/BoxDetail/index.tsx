import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  BoxListRes,
  BoxMapRes,
  BoxStatus,
  RentStatus,
} from 'smartbox-types';
import { successNotification } from 'src/actions/notifications';
import { Row } from 'src/components/Common';
import { EndRentPhoto } from 'src/components/Common/EndRentPhoto';
import { Button, Header, Link, Modal, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useRent } from 'src/hooks/useRent';
import { useRotatePasscodeMutation } from 'src/mutations';
import { useGetMyDetailsQuery, useRentDetailsQuery } from 'src/queries';
import { translateBoxDisplayStatus } from 'src/utils/box-display-status';
import { dateOnly } from 'src/utils/format-date';

import { Edit } from './Edit';

import './BoxDetail.scss';

interface Props {
  box: BoxListRes | BoxMapRes;
  stockId: string;
  callback?: () => void;
}

const BoxDetail = ({
  box: { rentId, id, identifier, status, area },
  stockId,
  callback,
}: Props) => {
  const dispatch = useDispatch();
  const { data: singleBoxDetail } = useRentDetailsQuery(rentId);
  const { mutateAsync: rotatePasscodeMutate, isPending: rotating } =
    useRotatePasscodeMutation(rentId);
  const { data: user } = useGetMyDetailsQuery();
  const { formatFinishAt, resolveRentFinishAt } = useRent();
  const [confirmingRotate, setConfirmingRotate] = useState(false);

  const rotatePasscode = async () => {
    try {
      await rotatePasscodeMutate();
      dispatch(successNotification(__('application.passcodeRotated')));
      setConfirmingRotate(false);
    } catch {
      // Error handling is handled by ApiService defaults.
    }
  };

  if (!user) return null;

  const isThisBoxFree = (data: string): boolean => data === '';
  // Prefer list/map box status when there is no occupying rent; rent
  // details default to "reserved" and would otherwise override outOfService/free.
  const displayStatus =
    rentId && singleBoxDetail?.id === rentId
      ? singleBoxDetail.status
      : status ?? BoxStatus.free;

  return (
    <>
      <Modal.Header title={__('application.singleStoreDetail')} />
      <Modal.Content>
        <div className="detail-wrapper">
          <Row label="application.storeNumber" content={identifier} />
          <Row label="application.storeSize" content={`${area}m²`} />

          {rentId && status !== BoxStatus.free && (
            <>
              <Row
                label="application.rentedBy"
                content={
                  singleBoxDetail?.owner
                    ? `${singleBoxDetail.owner.firstName} ${singleBoxDetail.owner.lastName}`
                    : '---'
                }
              />
              <Row
                label="application.startDate"
                content={
                  singleBoxDetail?.startAt
                    ? dateOnly(singleBoxDetail.startAt)
                    : '---'
                }
              />
              <Row
                label="application.endDate"
                content={
                  singleBoxDetail
                    ? formatFinishAt(
                        resolveRentFinishAt(singleBoxDetail),
                        singleBoxDetail.agreementType,
                      )
                    : '---'
                }
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
                    <Link href={`mailto:${singleBoxDetail?.owner?.email ?? ''}`}>
                      {singleBoxDetail?.owner
                        ? singleBoxDetail.owner.email
                        : __('application.lack')}
                    </Link>
                  )
                }
              />
              {singleBoxDetail?.id === rentId &&
                'passcode' in singleBoxDetail && (
                <Row
                  label="application.passcode"
                  content={
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        flexWrap: 'wrap',
                      }}
                    >
                      <span>{singleBoxDetail.passcode || '---'}</span>
                      {singleBoxDetail.status === RentStatus.rented &&
                        !confirmingRotate && (
                          <Button
                            size="small"
                            variant="secondary"
                            text="application.rotatePasscode"
                            onClick={() => setConfirmingRotate(true)}
                          />
                        )}
                      {singleBoxDetail.status === RentStatus.rented &&
                        confirmingRotate && (
                          <>
                            <Button
                              size="small"
                              variant="primary"
                              text="application.yes"
                              disabled={rotating}
                              onClick={() => void rotatePasscode()}
                            />
                            <Button
                              size="small"
                              variant="tertiary"
                              text="application.cancel"
                              disabled={rotating}
                              onClick={() => setConfirmingRotate(false)}
                            />
                          </>
                        )}
                    </span>
                  }
                />
              )}
            </>
          )}

          <Row
            label="application.storeState"
            content={translateBoxDisplayStatus(displayStatus)}
          />

          {singleBoxDetail?.endRentPhoto &&
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
            singleBoxDetailStatus={displayStatus}
            stockId={stockId}
          />
        </div>
      </Modal.Content>
    </>
  );
};

export default BoxDetail;
