import React from 'react';

import { Button } from '../../components/Branded';
import {
  ButtonsContainer,
  DashboardContainer,
  SectionHeader,
} from '../../components/Layout';
import { __ } from '../../helpers/i18n';

import './ApplicationError.scss';
import styled from 'styled-components';
import { colorOrDark } from '../../utils/color';
import { history } from 'src/history';

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
