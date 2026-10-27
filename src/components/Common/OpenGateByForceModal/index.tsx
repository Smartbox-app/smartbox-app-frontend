import React from 'react';
import { useDispatch } from 'react-redux';

import { Coordinate } from 'smartbox-types';
import { modal } from 'src/actions';
import { Button } from 'src/components/Branded';
import { ButtonsContainer } from 'src/components/Layout';
import { Modal } from 'src/components/ui';
import { __ } from "src/helpers/i18n";
import {
  useOpenGateMutation,
  useOpenKsmGateMutation,
} from 'src/mutations';

interface Props {
    gateId: string;
    latlon: Coordinate;
    notSupported?: boolean;
    cantRead?: boolean;
    tooFarAway?: boolean;
    useKsmV2?: boolean;
}

const OpenGateByForceModal = ({ gateId, latlon, tooFarAway, notSupported, cantRead, useKsmV2 }: Props) => {
    const dispatch = useDispatch();
    const { mutate: openGate } = useOpenGateMutation();
    const { mutate: openKsmGate } = useOpenKsmGateMutation();
    return (
      <>
        <Modal.Header title={__('application.confirmation')} />
        <Modal.Content>
          {tooFarAway && <p>{__('application.openGateByForceConfirmationTooFarAway')}</p>}
          {notSupported && <p>{__('application.openGateByForceConfirmationNotSupported')}</p>}
          {cantRead && <p>{__('application.openGateByForceConfirmationCantRead')}</p>}
        </Modal.Content>
        <Modal.Actions>
          <ButtonsContainer>
            <Button click={() => dispatch(modal.hideModal())} text="application.cancel" danger />
            <Button
              success
              click={() => {
                if (useKsmV2) {
                  openKsmGate({ gateId, geo: latlon, mode: 'force' });
                } else {
                  openGate({ gateId, geo: latlon, mode: 'force' });
                  dispatch(modal.hideModal());
                }
              }}
              text="application.openGate"
            />
          </ButtonsContainer>
        </Modal.Actions>
      </>
    );
}



export { OpenGateByForceModal }
