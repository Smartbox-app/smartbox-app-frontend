import React from 'react';
import { ButtonsContainer } from '../../Layout';
import { Button } from '../../Branded';
import { __ } from "../../../helpers/i18n";
import { useDispatch } from 'react-redux';
import { modal, gate } from '../../../actions';
import { Coordinate } from 'smartbox-types';
import { Modal } from 'src/components/ui';

interface Props {
    gateId: string;
    latlon: Coordinate;
    notSupported?: boolean;
    cantRead?: boolean;
    tooFarAway?: boolean;
}

const OpenGateByForceModal = ({ gateId, latlon, tooFarAway, notSupported, cantRead }: Props) => {
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
                dispatch(gate.askGateToOpenByForce(gateId, latlon));
                dispatch(modal.hideModal());
              }}
              text="application.openGate"
            />
          </ButtonsContainer>
        </Modal.Actions>
      </>
    );
}



export { OpenGateByForceModal }
