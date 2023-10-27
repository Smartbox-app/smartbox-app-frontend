import React from 'react';

import { Button } from '../../components/Branded';
import { ButtonsContainer, DashboardContainer, SectionHeader } from '../../components/Layout';
import { __ } from '../../helpers/i18n';

import './ApplicationError.scss';
import styled from 'styled-components';

const StyledApplicationError = styled.h1`
color: ${props => props.theme.colors.primary};
`

const ApplicationError = () => (
    <DashboardContainer>
        <div className="application-error">
            <StyledApplicationError>{__('application.ApplicationError')}</StyledApplicationError>
            <SectionHeader title='application.404Text' />
            <ButtonsContainer>
                <Button primary rounded to="/" text='application.backToHome' />
            </ButtonsContainer>
        </div>
    </DashboardContainer>
);

export default ApplicationError;
