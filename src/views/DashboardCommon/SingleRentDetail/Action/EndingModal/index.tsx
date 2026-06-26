import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Capacitor } from '@capacitor/core';
import { MyRentDetails, RentStatus } from 'smartbox-types';
import { history } from 'src/history';
import { ConfirmModal } from '../../../../../components/Common';
import { useEndMyRentMutation } from 'src/mutations';
import { useTenant } from 'src/hooks/useTenant';
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
import { Button, Modal } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import styled from 'styled-components';
import { ButtonsContainer } from 'src/components/Layout';
import { hideModal, showModal } from 'src/actions/modal';
import { RentEndedSuccessModal } from './RentEndedSuccessModal';
import { errorNotificationText } from 'src/actions/notifications';

interface Props {
  rent: MyRentDetails;
}

const StyledPhotoInput = styled.input`
  display: none;
`;

const StyledPreviewImage = styled.img`
  width: 100%;
  max-height: 30vh;
`;

const EndingModal = ({ rent }: Props) => {
  const dispatch = useDispatch();
  const { tenant } = useTenant();
  const { mutate: endRent, isSuccess, isPending } = useEndMyRentMutation();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoTakenAt, setPhotoTakenAt] = useState<Date | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const requirePhoto = tenant?.requireEndRentPhoto === true;
  const canCapture = canCaptureEndRentPhoto();
  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isSuccess) return;

    history.push('/user/main');
    dispatch(
      showModal(<RentEndedSuccessModal requiresStaffCheck={requirePhoto} />),
    );
  }, [isSuccess, dispatch, requirePhoto]);

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

  const handleConfirm = () => {
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

    endRent({
      rentId: rent.id,
      photo,
      photoTakenAt,
    });
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

  if (rent.status !== RentStatus.rented) {
    return (
      <ConfirmModal
        mainText="application.youCanNotEndRentNow"
        approveButtonText="application.understood"
        approveAction={() => {}}
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
        mainText="application.endRental"
        approveButtonText="application.endRent"
        approveAction={handleConfirm}
        cancelButtonText="application.back"
      />
    );
  }

  return (
    <>
      <Modal.Header title={__('application.endRental')} />
      <Modal.Content>
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
            text="application.endRent"
            disabled={!photo || isPending || isCapturing}
            onClick={handleConfirm}
          />
        </ButtonsContainer>
      </Modal.Actions>
    </>
  );
};

export default EndingModal;
