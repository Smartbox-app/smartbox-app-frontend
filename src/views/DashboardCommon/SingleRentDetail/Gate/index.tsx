import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Coordinate, RentGate } from 'smartbox-types';
import { Button, Spinner } from '../../../../components/Branded';
import { gate as gateActions, modal } from '../../../../actions';
import { isUser } from '../../../../utils/role-check';
import { OpenGateByForceModal } from '../../../../components/Common/OpenGateByForceModal';
import styled from 'styled-components';
import { useGetMyDetailsQuery } from 'src/queries';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { ButtonsContainer } from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { KsmGateButton } from '../Action/KsmGateButton';

interface Props {
  gate: RentGate;
  showKsmGateOpenV2?: boolean;
  disabled?: boolean;
}

const StyledGateContainer = styled.div`
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding-left: 16px;
  padding-right: 16px;
  text-align: center;
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const StyledGateDescription = styled.p`
  margin: 10px 0;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  @media (min-width: 768px) {
    text-align: left;
    justify-content: flex-start;
  }
  .gate-info-icon {
    margin-right: 8px;
  }
`;

const Gate = ({ gate, disabled = false }: Props) => {
  const dispatch = useDispatch();
  const { data: user } = useGetMyDetailsQuery();
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
      dispatch(gateActions.askGateToOpen(gate.id, location));
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
    if (!isUser(user!.role)) {
      dispatch(gateActions.askGateToOpenByStaff(gate.id));
      setLoading(false);
    } else {
      tryToOpenGateByLocation();
    }
  };

  const getButtonText = () => {
    return isUser(user!.role)
      ? 'application.openGate'
      : 'application.openGateStuff';
  };

  const gateButton = (
    <StyledGateContainer>
      {loading && <Spinner overlay halfTransparent />}
      <h4>{gate.name}</h4>
      {gate.description && (
        <StyledGateDescription>
          <span className="fa fa-info-circle gate-info-icon" />{' '}
          {gate.description}
        </StyledGateDescription>
      )}
      {gate.controlled && (
        <div className="slide-to-open">
          {gate.passcode ? (
            <p>
              {__('application.passcode')}: <strong>{gate.passcode}</strong>
            </p>
          ) : null}
          <ButtonsContainer left>
            {gate.version === 2 ? (
              <KsmGateButton
                gate={gate}
                layout="detail"
                buttonText={getButtonText()}
                disabled={disabled}
              />
            ) : (
              <Button
                text={getButtonText()}
                type="button"
                success
                disabled={disabled || loading}
                click={handleClick}
              />
            )}
          </ButtonsContainer>
        </div>
      )}
    </StyledGateContainer>
  );

  if (!isUser(user!.role)) {
    return <div className="open-gate-wrapper">{gateButton}</div>;
  }
  return (
    <div className="open-gate-wrapper">
      <div className="animation-wrapper">{gateButton}</div>
    </div>
  );
};

export default Gate;
