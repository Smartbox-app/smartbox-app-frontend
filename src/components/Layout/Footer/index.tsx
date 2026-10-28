import { Capacitor } from '@capacitor/core';
import React from 'react';
import styled from 'styled-components';

import { AppVersion } from 'src/components/AppVersion';
import { Logo } from 'src/components/Branded';
import { Link, Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useFileStorage } from 'src/hooks/useFileStorage';
import { useTenant } from 'src/hooks/useTenant';
import { colorOrDark } from 'src/utils/color';
import { clearCookieConsent } from 'src/utils/cookie-consent';

const StyledFooter = styled('footer')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  fontSize: 14,
  lineHeight: '20px',
  gap: theme.spacing * 4,
  '@media(min-width: 768px)': {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const StyledSpacer = styled('div')({
  width: 80,
});

const Data = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing * 2,
  flexWrap: 'wrap',
}));

const ManageCookiesButton = styled('button')(({ theme }) => ({
  color: colorOrDark(theme.colors.primary),
  fontWeight: 500,
  textDecoration: 'underline',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: 14,
}));

const Footer = () => {
  const { getAssetPath } = useFileStorage();
  const { tenant } = useTenant();
  return (
    <Section>
      <StyledFooter>
        <Logo width="small" />
        <Data>
          <Link target="_blank" href="/rules" rel="noreferrer">
            {__('application.statute')}
          </Link>

          <Link target="_blank" href="/privacy-policy" rel="noreferrer">
            {__('application.privacyPolicy')}
          </Link>
          {!Capacitor.isNativePlatform() && (
            <ManageCookiesButton type="button" onClick={clearCookieConsent}>
              {__('application.cookieConsentManage')}
            </ManageCookiesButton>
          )}

          {tenant?.links.map((link) => (
            <Link
              key={link.id}
              target="_blank"
              href={getAssetPath('attachment', link.fileName)}
              rel="noreferrer"
            >
              {link.name}
            </Link>
          ))}

          {/* <p>&copy; SmartBox Sp. J.</p> */}
          <Typography>&copy; {tenant?.name}</Typography>
          <AppVersion />
        </Data>
        <StyledSpacer />
      </StyledFooter>
    </Section>
  );
};

export default Footer;
