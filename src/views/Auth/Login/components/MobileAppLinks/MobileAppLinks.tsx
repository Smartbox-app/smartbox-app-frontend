import React from 'react';
import { Capacitor } from '@capacitor/core';
import styled from 'styled-components';
import { Section, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { TenantForUsers } from 'smartbox-types';
import { getClientMobileOs } from 'src/utils/detect-client-mobile-os';
import {
  hasMobileAppAndroidLink,
  hasMobileAppIosLink,
} from 'src/utils/tenant-mobile-app-links';
import { AppStoreBadge } from 'src/badges/AppStore';
import { GooglePlayBadge } from 'src/badges/GooglePlay';

const LinksRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing * 4,
  justifyContent: 'center',
  alignItems: 'center',
}));

const BadgeLink = styled('a')({
  display: 'inline-flex',
  lineHeight: 0,
});

type MobileAppLinksProps = {
  tenant: TenantForUsers;
};

export const MobileAppLinks = ({ tenant }: MobileAppLinksProps) => {
  if (Capacitor.isNativePlatform()) return null;

  const clientOs = getClientMobileOs();
  if (!clientOs) return null;

  const showAndroidLink =
    clientOs === 'android' && hasMobileAppAndroidLink(tenant);
  const showIosLink = clientOs === 'ios' && hasMobileAppIosLink(tenant);
  const { mobileAppAndroidLink, mobileAppIosLink } = tenant;

  if (!showAndroidLink && !showIosLink) return null;

  return (
    <Section align="center">
      <Typography>{__('auth.mobile_app_heading')}</Typography>
      <LinksRow>
        {showAndroidLink ? (
          <BadgeLink
            href={mobileAppAndroidLink!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={__('auth.mobile_app_android')}
          >
            <GooglePlayBadge />
          </BadgeLink>
        ) : null}
        {showIosLink ? (
          <BadgeLink
            href={mobileAppIosLink!}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={__('auth.mobile_app_ios')}
          >
            <AppStoreBadge />
          </BadgeLink>
        ) : null}
      </LinksRow>
    </Section>
  );
};
