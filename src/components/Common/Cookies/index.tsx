import React, { useState } from 'react';
import './Cookies.scss';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { darken } from 'polished';

const StyledCookieWrapper = styled.div`
  background-color: ${props => props.theme.colors.primary};
  border-top: 3px solid ${props => darken(0.05, props.theme.colors.primary)};
`

const Cookies = () => {
  const areAccepted = () => {
    try {
      return JSON.parse(localStorage.getItem('cookies') || 'false');
    } catch (e) {
      return false;
    }
  };

  const [accepted, setAccepted] = useState<boolean>(areAccepted());

  const accept = () => {
    localStorage.setItem('cookies', JSON.stringify(true));
    setAccepted(true);
  };

  return (
    <StyledCookieWrapper className={`cookies-information ${accepted ? 'hide-cookies-bar' : ''}`}>
      <p>
        {__('application.privacyPoliceInfo')}{' '}
        <a target="_blank" href="/assets/2022_01_01_Polityka_Prywatnosci_SmartBox.pdf">
          <u>{__('application.privacyPolicy1')}</u>
        </a>
        .
      </p>
      <span className="exit" onClick={accept}>
        &times;
      </span>
    </StyledCookieWrapper>
  );
};

export default Cookies;
