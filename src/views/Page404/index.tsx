import React from 'react';
import styled from 'styled-components';

import { Button } from 'src/components/Branded';
import { ButtonsContainer, DashboardContainer, SectionHeader } from 'src/components/Layout';
import { colorOrDark } from 'src/utils/color';

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
