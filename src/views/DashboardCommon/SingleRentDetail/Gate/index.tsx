import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { bindActionCreators } from 'redux';
import { Coordinate } from 'smartbox-types';
import { Button, Spinner } from '../../../../components/Branded';
import { __ } from '../../../../helpers/i18n';
import { ApplicationState } from '../../../../reducers';
import { gate, modal } from '../../../../actions';
import { isUser } from '../../../../utils/role-check';

import './Gate.scss';
import { OpenGateByForceModal } from '../../../../components/Common/OpenGateByForceModal';
import styled from 'styled-components';

interface Props {
    stockId: string;
}

const StyledGateImageContainer = styled.div`
.gate-rect-1 {
    fill: ${({ theme }) => theme.colors.primary};
}
.gate-rect-2 {
    fill: ${({ theme }) => theme.colors.primary};
}
`

const Gate = ({ stockId }: Props) => {
    const dispatch = useDispatch();
    const user = useSelector((state: ApplicationState) => state.user.details!);
    const startAnimation = useSelector((state: ApplicationState) => state.gate.startAnimation);
    const [loading, setLoading] = useState<boolean>(false);

    const openGateByLocation = (position: any) => {
        const location: Coordinate = {
            lon: position.coords.longitude,
            lat: position.coords.latitude,
        };
        dispatch(gate.askGateToOpen(stockId, location));
        setLoading(false);
    };

    const handleError = () => {
        dispatch(modal.showModal(<OpenGateByForceModal cantRead stockId={stockId} latlon={{ lat: '0', lon: '0' }} />))
        setLoading(false);
    }

    const tryToOpenGateByLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(openGateByLocation, handleError);
        } else {
            dispatch(modal.showModal(<OpenGateByForceModal notSupported stockId={stockId} latlon={{ lat: '0', lon: '0' }} />))
            setLoading(false);
        }
    };

    useEffect(() => {
        dispatch(gate.gateOpenStartAnimation(false));
    }, [stockId])

    const getButtonText = () => {
        if (startAnimation) {
            return 'application.openingGate';
        }

        return isUser(user.role) ? 'application.openGate' : 'application.openGateStuff';
    };

    const handleClick = () => {
        setLoading(true);
        if (!isUser(user.role)) {
            dispatch(gate.askGateToOpenByStaff(stockId))
            setLoading(false);
        } else {
            tryToOpenGateByLocation();
        }
    }

    const gateOpenningAnimation = (
        <div className="gate-animation">
            {loading && <Spinner overlay halfTransparent />}
            <StyledGateImageContainer>
                <ReactSVG src={`${startAnimation ? '/assets/images/Group46.svg' : '/assets/images/Group39.svg'}`} />
            </StyledGateImageContainer>
            <div className="slide-to-open">
                <Button
                    text={getButtonText()}
                    big
                    type='button'
                    primary
                    click={handleClick}
                    disabled={isUser(user.role) ? startAnimation : false}
                />
            </div>
        </div>
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
            ...gate,
        },
        dispatch,
    );

export default connect(mapStateToProps, mapDispatchToProps)(Gate);
