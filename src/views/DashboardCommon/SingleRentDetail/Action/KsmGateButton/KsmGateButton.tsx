import React, { useState, type ComponentProps } from 'react';
import { useDispatch } from 'react-redux';
import { Coordinate, RentGate } from 'smartbox-types';
import { OpenGateByForceModal } from 'src/components/Common/OpenGateByForceModal';
import { modal } from 'src/actions';
import { requestKsmGateOpenV2 } from 'src/actions/ksm-gate';
import { Button as UIButton } from 'src/components/ui';
import { Button as BrandedButton } from 'src/components/Branded';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

interface Props {
  gate: RentGate;
  layout?: 'action' | 'detail';
  buttonText?: string;
}

type ForceModalProps = Pick<
  ComponentProps<typeof OpenGateByForceModal>,
  'notSupported' | 'cantRead' | 'tooFarAway'
>;

export const KsmGateButton = ({
  gate,
  layout = 'action',
  buttonText = 'application.openGate',
}: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const ensurePermission = async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return true;

    const status: PermissionStatus = await Geolocation.checkPermissions();
    if (status.location === 'granted') return true;

    const request = await Geolocation.requestPermissions();
    return request.location === 'granted';
  };

  const getCurrentLocation = async (): Promise<Coordinate> => {
    if (Capacitor.isNativePlatform()) {
      const hasPermission = await ensurePermission();
      if (!hasPermission) throw new Error('permission_denied');

      const position = await Geolocation.getCurrentPosition();
      return {
        lat: position.coords.latitude.toString(),
        lon: position.coords.longitude.toString(),
      };
    }

    if (navigator.geolocation) {
      return new Promise<Coordinate>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({
              lat: pos.coords.latitude.toString(),
              lon: pos.coords.longitude.toString(),
            }),
          reject,
        );
      });
    }

    throw new Error('not_supported');
  };

  const showForceModal = (props: ForceModalProps) => {
    dispatch(
      modal.showModal(
        <OpenGateByForceModal
          gateId={gate.id}
          latlon={{ lat: '0', lon: '0' }}
          useKsmV2
          {...props}
        />,
      ),
    );
  };

  const tryToOpenGateByLocation = async () => {
    try {
      const location = await getCurrentLocation();
      dispatch(requestKsmGateOpenV2(gate.id, location));
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'not_supported') {
        showForceModal({ notSupported: true });
      } else if (error instanceof Error && error.message === 'permission_denied') {
        showForceModal({ cantRead: true });
      } else {
        showForceModal({ cantRead: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!gate.controlled) return;

    setLoading(true);
    void tryToOpenGateByLocation();
  };

  if (layout === 'detail') {
    return (
      <BrandedButton
        disabled={loading}
        text={buttonText}
        type="button"
        success
        click={handleClick}
      />
    );
  }

  return (
    <UIButton
      disabled={loading}
      text={buttonText}
      type="button"
      variant="success"
      size="small"
      onClick={handleClick}
    />
  );
};
