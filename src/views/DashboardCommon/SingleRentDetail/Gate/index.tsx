import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { bindActionCreators } from 'redux';
import { Coordinate, RentGate } from 'smartbox-types';
import { Button, Spinner } from '../../../../components/Branded';
import { __ } from '../../../../helpers/i18n';
import { ApplicationState } from '../../../../reducers';
import { gate as gateActions, modal } from '../../../../actions';
import { isUser } from '../../../../utils/role-check';

import './Gate.scss';
import { OpenGateByForceModal } from '../../../../components/Common/OpenGateByForceModal';
import styled from 'styled-components';
import { SimpleHeader } from 'src/components/Layout';

interface Props {
    gate: RentGate;
}

const StyledGateImageContainer = styled.div`
.gate-rect-1 {
    fill: ${({ theme }) => theme.colors.primary};
}
.gate-rect-2 {
    fill: ${({ theme }) => theme.colors.primary};
}
`

const StyledGateContainer = styled.div`
border-left: 4px solid  ${({ theme }) => theme.colors.primary};
padding-left: 16px;
}
`

const StyledGateTitle = styled.h4`
margin: 10px 0`

const StyledGateDescription = styled.p`
margin: 10px 0;
display: flex;
align-items: center;

.gate-info-icon {
    margin-right: 8px;
}
`

const Gate = ({ gate }: Props) => {
    const dispatch = useDispatch();
    const user = useSelector((state: ApplicationState) => state.user.details!);
    const startAnimation = useSelector((state: ApplicationState) => state.gate.startAnimation);
    const [loading, setLoading] = useState<boolean>(false);

    const openGateByLocation = (position: any) => {
        const location: Coordinate = {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
        };
        dispatch(gateActions.askGateToOpen(gate.id, location));
        setLoading(false);
    };

    const handleError = () => {
        dispatch(modal.showModal(<OpenGateByForceModal cantRead gateId={gate.id} latlon={{ lat: '0', lon: '0' }} />))
        setLoading(false);
    }

    const tryToOpenGateByLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(openGateByLocation, handleError);
        } else {
            dispatch(modal.showModal(<OpenGateByForceModal notSupported gateId={gate.id} latlon={{ lat: '0', lon: '0' }} />))
            setLoading(false);
        }
    };

    useEffect(() => {
        dispatch(gateActions.gateOpenStartAnimation(false));
    }, [gate.id])

    const getButtonText = () => {
        if (startAnimation) {
            return 'application.openingGate';
        }

        return isUser(user.role) ? 'application.openGate' : 'application.openGateStuff';
    };

    const handleClick = () => {
        setLoading(true);
        if (!isUser(user.role)) {
            dispatch(gateActions.askGateToOpenByStaff(gate.id))
            setLoading(false);
        } else {
            tryToOpenGateByLocation();
        }
    }

    const gateOpenningAnimation = (
        <StyledGateContainer>
            {loading && <Spinner overlay halfTransparent />}
            <StyledGateTitle>{gate.name}</StyledGateTitle>
            {gate.description && <StyledGateDescription><span className='fa fa-info-circle gate-info-icon' /> {gate.description}</StyledGateDescription>}
            {/* <StyledGateImageContainer>
                <ReactSVG src={`${startAnimation ? '/assets/images/Group46.svg' : '/assets/images/Group39.svg'}`} />
            </StyledGateImageContainer> */}
            {gate.controlled && <div className="slide-to-open">
                <Button
                    text={getButtonText()}
                    type='button'
                    primary
                    click={handleClick}
                    disabled={isUser(user.role) ? startAnimation : false}
                />
            </div>}
        </StyledGateContainer>
    );
    if (!isUser(user.role)) {
        return <div className="open-gate-wrapper">{gateOpenningAnimation}</div>;
    }
    return (
        <div className="open-gate-wrapper">
            <div className="animation-wrapper">{gateOpenningAnimation}</div>
        </div>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    startAnimation: state.gate.startAnimation,
    user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...gateActions,
        },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(Gate);
