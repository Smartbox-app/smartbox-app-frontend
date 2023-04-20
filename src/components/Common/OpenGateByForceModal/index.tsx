import React from 'react';
import { ButtonsContainer } from '../../Layout';
import { Button } from '..';
import { __ } from "../../../helpers/i18n";
import { useDispatch } from 'react-redux';
import { modal, gate } from '../../../actions';
import { Coordinate } from 'smartbox-types';

interface Props {
    stockId: string;
    latlon: Coordinate;
    notSupported?: boolean;
    cantRead?: boolean;
    tooFarAway?: boolean;
}

const OpenGateByForceModal = ({ stockId, latlon, tooFarAway, notSupported, cantRead }: Props) => {
    const dispatch = useDispatch();
    return <div className="open-gate-by-force-modal-wrapper">
        {tooFarAway && <p>{__('application.openGateByForceConfirmationTooFarAway')}</p>}
        {notSupported && <p>{__('application.openGateByForceConfirmationNotSupported')}</p>}
        {cantRead && <p>{__('application.openGateByForceConfirmationCantRead')}</p>}
        <ButtonsContainer>
            <Button click={() => dispatch(modal.hideModal())} text={'application.cancel'} danger />
            <Button
                success
                click={() => {
                    dispatch(gate.askGateToOpenByForce(stockId, latlon))
                    dispatch(modal.hideModal())
                }}
                text={'application.openGate'}
            />
        </ButtonsContainer>
    </div>
}



export { OpenGateByForceModal }
