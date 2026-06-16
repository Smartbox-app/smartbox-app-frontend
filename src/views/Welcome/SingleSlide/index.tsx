import React, { useCallback } from 'react';
import { ButtonsContainer } from '../../../components/Layout';
import { Button } from '../../../components/Branded';
import styled from 'styled-components';
import { useTenant } from '../../../hooks/useTenant';
import ApiService from '../../../services/api-service';
import { TenantForUsers } from 'smartbox-types';
import './SingleSlide.scss';

interface Props {
    item: string;
    last?: boolean;
}

const StyledSlideContainer = styled.div<{ background: string }>`
background-image: url(${props => props.background});
background-size: cover;
background-position: center;
`

const SingleSlide = ({ item, last }: Props) => {
    const { tenant } = useTenant();

    const getTenantBackgroundPath = useCallback((t: TenantForUsers) => {
        if (!t.id) return t.background;
        return `${ApiService.url}tenant/background/${t.id}`;
    }, []);


    if (!tenant) return null;

    return (
        <StyledSlideContainer  background={getTenantBackgroundPath(tenant)}  className="slide-container">
            <div className="slide-overlayer"></div>
            <div className="slide-content">
                <div className="slide-description">
                    <img src={`${ApiService.url}tenant/slide/${item}`} />
                </div>
                {last && (
                    <ButtonsContainer className="swiper-buttons-container">
                        <Button text="application.register" to="/register" primary className="swiper-button" big />
                    </ButtonsContainer>
                )}
                <ButtonsContainer className="swiper-buttons-container">
                    <Button text="application.back" to="/login" className="swiper-button back" big />
                </ButtonsContainer>
            </div>
        </StyledSlideContainer>
    );
};

export default SingleSlide;
