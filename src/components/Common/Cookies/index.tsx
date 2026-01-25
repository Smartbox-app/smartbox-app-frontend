import React, { useState } from 'react';
import './Cookies.scss';
import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { darken } from 'polished';
import { getColorForBackground } from '../../../utils/color';
import { useSelector } from 'react-redux';
import { ApplicationState } from 'src/reducers';
import { Link } from 'src/components/ui';
import ApiService from 'src/services/api-service';

const StyledCookieWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => getColorForBackground(props.theme.colors.primary)};
  border-top: 3px solid ${(props) => darken(0.05, props.theme.colors.primary)};
`;

const Cookies = () => {
  const tenant = useSelector((state: ApplicationState) => state.tenant);

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
    <StyledCookieWrapper
      className={`cookies-information ${accepted ? 'hide-cookies-bar' : ''}`}
    >
      {tenant ? (
        <p>
          {__('application.privacyPoliceInfo')}{' '}
          <Link
            target="_blank"
            href={`${ApiService.url}tenant/privacy/${tenant.id}`}
            rel="noreferrer"
          >
            <u>{__('application.privacyPolicy1')}</u>
          </Link>
          .
        </p>
      ) : null}
      <span className="exit" onClick={accept}>
        &times;
      </span>
    </StyledCookieWrapper>
  );
};

export default Cookies;
