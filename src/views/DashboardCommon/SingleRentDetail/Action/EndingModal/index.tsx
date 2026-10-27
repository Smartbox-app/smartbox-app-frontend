import { Capacitor } from '@capacitor/core';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { MyRentDetails, RentStatus } from 'smartbox-types';
import { hideModal, showModal } from 'src/actions/modal';
import { errorNotificationText } from 'src/actions/notifications';
import { ConfirmModal } from 'src/components/Common';
import { ButtonsContainer } from 'src/components/Layout';
import { Button, Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { useEndMyAgreementMutation, useEndMyRentMutation } from 'src/mutations';
import { canCaptureEndRentPhoto } from 'src/utils/can-capture-end-rent-photo';
import {
  captureEndRentPhotoWithCamera,
  isCameraPermissionDenied,
} from 'src/utils/capture-end-rent-photo';
import {
  assertEndRentPhotoFresh,
  EndRentPhotoTooOldError,
  getFilePhotoTakenAt,
} from 'src/utils/end-rent-photo-age';
import { dateOnly } from 'src/utils/format-date';
import { isOpenEndedAgreement, latestPeriodFinishAt } from 'src/utils/rent';
import { RentEndedSuccessModal } from './RentEndedSuccessModal';

type EndingModalProps = {
  rent: MyRentDetails;
};

const StyledPhotoInput = styled.input`
  display: none;
`;

const StyledPreviewImage = styled.img`
  width: 100%;
  max-height: 30vh;
`;

const EndingModal = ({ rent }: EndingModalProps) => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  const { mutate: endRent, isPending: isEndingRent } = useEndMyRentMutation();
  const { mutate: endAgreement, isPending: isEndingAgreement } =
    useEndMyAgreementMutation();
  const isPending = isEndingRent || isEndingAgreement;
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoTakenAt, setPhotoTakenAt] = useState<Date | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const requirePhoto = tenant?.requireEndRentPhoto === true;
  const canCapture = canCaptureEndRentPhoto();
  const isNativeApp = Capacitor.isNativePlatform();
  const isOpenEnded = isOpenEndedAgreement(rent.agreementType);
  const isAwaitingFinish = rent.status === RentStatus.awaitingFinish;
  const accessUntil = latestPeriodFinishAt(rent.periods);
  const accessUntilLabel = accessUntil ? dateOnly(accessUntil) : null;

  const showScheduledSuccessModal = () => {
    if (!accessUntilLabel) return;
    dispatch(
      showModal(
        <RentEndedSuccessModal
          variant="scheduled"
          accessUntil={accessUntilLabel}
        />,
      ),
    );
  };

  const showEndedSuccessModal = () => {
    dispatch(
      showModal(
        <RentEndedSuccessModal
          variant="ended"
          requiresStaffCheck={requirePhoto}
        />,
      ),
    );
  };

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [photo]);

  const handleScheduleOpenEndedEnd = () => {
    endAgreement(
      { rentId: rent.id },
      { onSuccess: showScheduledSuccessModal },
    );
  };

  const handleConfirmFinish = () => {
    if (requirePhoto && !photo) return;

    if (requirePhoto && photoTakenAt) {
      try {
        assertEndRentPhotoFresh(photoTakenAt);
      } catch (error) {
        if (error instanceof EndRentPhotoTooOldError) {
          dispatch(errorNotificationText('application.endRentPhotoTooOld'));
          return;
        }
      }
    }

    endRent(
      {
        rentId: rent.id,
        photo,
        photoTakenAt,
      },
      {
        onSuccess: showEndedSuccessModal,
      },
    );
  };

  const applyCapturedPhoto = (file: File, takenAt: Date) => {
    try {
      assertEndRentPhotoFresh(takenAt);
    } catch (error) {
      if (error instanceof EndRentPhotoTooOldError) {
        dispatch(errorNotificationText('application.endRentPhotoTooOld'));
        return;
      }

      throw error;
    }

    setPhoto(file);
    setPhotoTakenAt(takenAt);
  };

  const handleTakePhoto = async () => {
    if (isNativeApp) {
      setIsCapturing(true);

      try {
        const capturedPhoto = await captureEndRentPhotoWithCamera();
        if (capturedPhoto) {
          applyCapturedPhoto(capturedPhoto.file, capturedPhoto.takenAt);
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === 'camera_permission_denied'
        ) {
          dispatch(
            errorNotificationText('application.endRentCameraPermissionDenied'),
          );
          return;
        }

        if (isCameraPermissionDenied(error)) {
          dispatch(
            errorNotificationText('application.endRentCameraPermissionDenied'),
          );
          return;
        }

        dispatch(
          errorNotificationText('application.endRentPhotoCaptureFailed'),
        );
      } finally {
        setIsCapturing(false);
      }

      return;
    }

    inputRef.current?.click();
  };

  if (
    rent.status !== RentStatus.rented &&
    rent.status !== RentStatus.awaitingFinish
  ) {
    return (
      <ConfirmModal
        mainText="application.youCanNotEndRentNow"
        approveButtonText="application.understood"
        approveAction={() => {}}
        cancelButtonText="application.back"
      />
    );
  }

  if (isOpenEnded && !isAwaitingFinish) {
    if (!accessUntilLabel) {
      return (
        <ConfirmModal
          mainText="application.youCanNotEndRentNow"
          approveButtonText="application.understood"
          approveAction={() => {}}
          cancelButtonText="application.back"
        />
      );
    }

    return (
      <ConfirmModal
        isLoading={isPending}
        mainText={__('application.endOpenEndedRental', {
          date: accessUntilLabel,
        })}
        approveButtonText="application.endAgreement"
        approveAction={handleScheduleOpenEndedEnd}
        cancelButtonText="application.back"
      />
    );
  }

  if (requirePhoto && !canCapture) {
    return (
      <ConfirmModal
        mainText={__('application.endRentPhotoMobileOnly', {
          name: tenant?.name,
        })}
        approveButtonText="application.understood"
        approveAction={() => {}}
        cancelButtonText="application.back"
      />
    );
  }

  if (!requirePhoto) {
    return (
      <ConfirmModal
        isLoading={isPending}
        mainText={
          isAwaitingFinish
            ? 'application.confirmOpenEndedFinishInfo'
            : 'application.endRental'
        }
        approveButtonText={
          isAwaitingFinish
            ? 'application.confirmOpenEndedFinish'
            : 'application.endRent'
        }
        approveAction={handleConfirmFinish}
        cancelButtonText="application.back"
      />
    );
  }

  return (
    <>
      <Modal.Header
        title={__(
          isAwaitingFinish
            ? 'application.confirmOpenEndedFinish'
            : 'application.endRental',
        )}
      />
      <Modal.Content>
        {isAwaitingFinish ? (
          <p>{__('application.confirmOpenEndedFinishInfo')}</p>
        ) : null}
        <p>{__('application.endRentPhotoRequiredInfo')}</p>
        <p>{__('application.endRentPhotoMaxAgeInfo')}</p>
        {previewUrl ? <StyledPreviewImage src={previewUrl} /> : null}
        <StyledPhotoInput
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            event.target.value = '';

            if (!file) return;

            applyCapturedPhoto(file, getFilePhotoTakenAt(file));
          }}
        />
        <ButtonsContainer>
          <Button
            type="button"
            variant="secondary"
            text="application.endRentTakePhoto"
            disabled={isCapturing || isPending}
            onClick={() => void handleTakePhoto()}
          />
        </ButtonsContainer>
      </Modal.Content>
      <Modal.Actions>
        <ButtonsContainer>
          <Button
            type="button"
            variant="secondary"
            text="application.back"
            onClick={() => dispatch(hideModal())}
          />
          <Button
            type="button"
            variant="primary"
            text={
              isAwaitingFinish
                ? 'application.confirmOpenEndedFinish'
                : 'application.endRent'
            }
            disabled={!photo || isPending || isCapturing}
            onClick={handleConfirmFinish}
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};

export default EndingModal;
