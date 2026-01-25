import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Coordinate, RentGate } from 'smartbox-types';
import { OpenGateByForceModal } from 'src/components/Common/OpenGateByForceModal';
import { modal } from 'src/actions';
import { askGateToOpen } from 'src/actions/gate';
import { Button } from 'src/components/ui';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

interface Props {
  gate: RentGate;
}

export const GateButton = ({ gate }: Props) => {
  const dispatch = useDispatch();
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
    try {
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
      } else {
        throw new Error('not_supported');
      }
    } catch (error) {
      throw error;
    }
  };

  const tryToOpenGateByLocation = async () => {
    try {
      const location = await getCurrentLocation();
      dispatch(askGateToOpen(gate.id, location));
    } catch (error: any) {
      if (error.message === 'not_supported') {
        dispatch(
          modal.showModal(
            <OpenGateByForceModal
              notSupported
              gateId={gate.id}
              latlon={{ lat: '0', lon: '0' }}
            />,
          ),
        );
      } else if (error.message === 'permission_denied') {
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
    if (!gate.controlled) return;

    setLoading(true);
    tryToOpenGateByLocation();
  };

  return (
    <Button
      disabled={loading}
      text="application.openGate"
      type="button"
      variant="success"
      size="small"
      onClick={handleClick}
    />
  );
};
