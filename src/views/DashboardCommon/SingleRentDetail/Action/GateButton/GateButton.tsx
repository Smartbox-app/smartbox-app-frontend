import { Capacitor } from '@capacitor/core';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Coordinate, RentGate } from 'smartbox-types';
import { modal } from 'src/actions';
import { OpenGateByForceModal } from 'src/components/Common/OpenGateByForceModal';
import { Button } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useOpenGateMutation } from 'src/mutations';

interface Props {
  gate: RentGate;
  withName?: boolean;
  disabled?: boolean;
}

export const GateButton = ({
  gate,
  withName = false,
  disabled = false,
}: Props) => {
  const dispatch = useDispatch();
  const { mutate: openGate, isPending } = useOpenGateMutation();
  const [loading, setLoading] = useState(false);

  const handleError = () => {
    dispatch(
      modal.showModal(
        <OpenGateByForceModal
          cantRead
          gateId={gate.id}
          latlon={{ lat: '0', lon: '0' }}
        />,
      ),
    );
    setLoading(false);
  };

  // Check and request permission on native platforms
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
    } else if (navigator.geolocation) {
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

  const tryToOpenGateByLocation = async () => {
    try {
      const location = await getCurrentLocation();
      openGate({ gateId: gate.id, geo: location, mode: 'default' });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'not_supported') {
        dispatch(
          modal.showModal(
            <OpenGateByForceModal
              notSupported
              gateId={gate.id}
              latlon={{ lat: '0', lon: '0' }}
            />,
          ),
        );
      } else if (
        error instanceof Error &&
        error.message === 'permission_denied'
      ) {
        dispatch(
          modal.showModal(
            <OpenGateByForceModal
              cantRead
              gateId={gate.id}
              latlon={{ lat: '0', lon: '0' }}
            />,
          ),
        );
      } else {
        handleError();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (disabled || !gate.controlled) return;

    setLoading(true);
    tryToOpenGateByLocation();
  };

  return (
    <Button
      disabled={disabled || loading || isPending}
      text={withName ? undefined : 'application.openGate'}
      rawText={
        withName
          ? __('application.openNamedGate', { name: gate.name })
          : undefined
      }
      type="button"
      variant="success"
      size="small"
      onClick={handleClick}
    />
  );
};
