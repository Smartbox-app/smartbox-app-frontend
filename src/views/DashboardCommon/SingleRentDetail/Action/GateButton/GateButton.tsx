import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Coordinate, RentGate } from 'smartbox-types';
import { OpenGateByForceModal } from 'src/components/Common/OpenGateByForceModal';
import { modal } from 'src/actions';
import { askGateToOpen } from 'src/actions/gate';
import { Button } from 'src/components/ui';

interface Props {
  gate: RentGate;
}

export const GateButton = ({ gate }: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);

  const openGateByLocation = (position: any) => {
    const location: Coordinate = {
      lon: position.coords.longitude,
      lat: position.coords.latitude,
    };
    dispatch(askGateToOpen(gate.id, location));
    setLoading(false);
  };

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

  const tryToOpenGateByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(openGateByLocation, handleError);
    } else {
      dispatch(
        modal.showModal(
          <OpenGateByForceModal
            notSupported
            gateId={gate.id}
            latlon={{ lat: '0', lon: '0' }}
          />,
        ),
      );
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
      variant="primary"
      size="small"
      onClick={handleClick}
    />
  );
};
