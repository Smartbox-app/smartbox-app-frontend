import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ButtonsContainer } from '../../../components/Layout';
import { Logo, Button } from '../../../components/Branded';
import styled from 'styled-components';
import { useTenant } from '../../../hooks/useTenant';
import ApiService from '../../../services/api-service';
import { TenantEntity } from '../../../../../smartbox-back/types/tenant';
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

    const getTenantBackgroundPath = useCallback((tenant: TenantEntity) => {
        if (!tenant.id) return tenant.background;
        return `${ApiService.url}tenant/background/${tenant.id}`;
    }, [tenant])


    if (!tenant) return null;

    return (
        <StyledSlideContainer  background={getTenantBackgroundPath(tenant)}  className="slide-container">
            <div className="slide-overlayer"></div>
            <div className="slide-logo">
                <Link to="/">
                    <Logo />
                </Link>
            </div>
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
