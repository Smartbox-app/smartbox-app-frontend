import React from 'react';
import styled from 'styled-components';

import { Button } from 'src/components/Branded';
import {
  ButtonsContainer,
  DashboardContainer,
  SectionHeader,
} from 'src/components/Layout';
import { __ } from 'src/helpers/i18n';
import { history } from 'src/history';
import { colorOrDark } from 'src/utils/color';

import './ApplicationError.scss';

const StyledApplicationError = styled.h1`
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
`;

const ApplicationError = () => {
  const handleClick = () => {
    history.push('/');
    window.location.reload();
  };
  return (
    <DashboardContainer>
      <div className="application-error">
        <StyledApplicationError>
          {__('application.ApplicationError')}
        </StyledApplicationError>
        <SectionHeader title="application.404Text" />
        <ButtonsContainer>
          <Button
            primary
            rounded
            click={handleClick}
            text="application.backToHome"
          />
        </ButtonsContainer>
      </div>
    </DashboardContainer>
  );
};

export default ApplicationError;
