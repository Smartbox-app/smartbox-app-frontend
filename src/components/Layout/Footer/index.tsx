import React from 'react';

import { __ } from '../../../helpers/i18n';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../reducers';
import ApiService from '../../../services/api-service';
import { AppVersion } from '../../../components/AppVersion';
import { Link, Section, Typography } from '../../ui';
import { Logo } from '../../Branded';

const StyledFooter = styled('footer')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: 14,
  gap: theme.spacing * 4,
  '@media(min-width: 768px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const Data = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing * 2,
  flexWrap: 'wrap',
}));

const Footer = () => {
  const tenant = useSelector((state: ApplicationState) => state.tenant);
  return (
    <Section>
      <StyledFooter>
        <Logo width="small" />
        <Data>
          {tenant?.rules && (
            <Link
              target="_blank"
              href={`${ApiService.url}tenant/rules/${tenant.id}`}
              rel="noreferrer"
            >
              {__('application.statute')}
            </Link>
          )}
          {tenant?.privacy && (
            <Link
              target="_blank"
              href={`${ApiService.url}tenant/privacy/${tenant.id}`}
              rel="noreferrer"
            >
              {__('application.privacyPolicy')}
            </Link>
          )}

          {/* <p>&copy; SmartBox Sp. J.</p> */}
          <Typography>&copy; {tenant?.name}</Typography>
          <AppVersion />
        </Data>
        <span />
      </StyledFooter>
    </Section>
  );
};

export default Footer;
