import React from 'react';
import { ButtonsContainer } from '../../Layout';
import { Button } from '../../Branded';
import { __ } from "../../../helpers/i18n";
import { useDispatch } from 'react-redux';
import { modal, gate, ksmGate } from '../../../actions';
import { Coordinate } from 'smartbox-types';
import { Modal } from 'src/components/ui';

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
                  dispatch(ksmGate.requestKsmGateOpenByForceV2(gateId, latlon));
                } else {
                  dispatch(gate.askGateToOpenByForce(gateId, latlon));
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
