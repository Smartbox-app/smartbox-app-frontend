import React from 'react';

import { Button } from '../../components/Branded';
import { ButtonsContainer, DashboardContainer, SectionHeader } from '../../components/Layout';

import styled from 'styled-components';
import { colorOrDark } from '../../utils/color';

const StyledApplicationError = styled.h1`
color: ${props => colorOrDark(props.theme.colors.primary)};
`

const Page404 = () => (
    <DashboardContainer>
        <div className="application-error">
            <StyledApplicationError>{404}</StyledApplicationError>
            <SectionHeader title='application.404Text' />
            <ButtonsContainer>
                <Button primary rounded to="/" text='application.backToHome' />
            </ButtonsContainer>
        </div>
    </DashboardContainer>
);

export default Page404;
