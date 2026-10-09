import React from 'react';
import styled from 'styled-components';
import { Header, Section, Stack, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';

const events = [
  {
    title: 'application.tenantAnalyticsSignUpTitle',
    when: 'application.tenantAnalyticsSignUpWhen',
    gtm: 'application.tenantAnalyticsPayloadGtmSignUp',
    meta: 'application.tenantAnalyticsPayloadMetaSignUp',
    matching: 'application.tenantAnalyticsMatchingSignUp',
  },
  {
    title: 'application.tenantAnalyticsBeginCheckoutTitle',
    when: 'application.tenantAnalyticsBeginCheckoutWhen',
    gtm: 'application.tenantAnalyticsPayloadGtmCheckout',
    meta: 'application.tenantAnalyticsPayloadMetaCheckout',
    matching: 'application.tenantAnalyticsMatchingCustomer',
  },
  {
    title: 'application.tenantAnalyticsPurchaseTitle',
    when: 'application.tenantAnalyticsPurchaseWhen',
    gtm: 'application.tenantAnalyticsPayloadGtmPurchase',
    meta: 'application.tenantAnalyticsPayloadMetaPurchase',
    matching: 'application.tenantAnalyticsMatchingCustomer',
  },
];

const Ids = styled('dl')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'max-content 1fr',
  gap: `${theme.spacing * 2}px ${theme.spacing * 4}px`,
  margin: 0,
}));

const IdLabel = styled('dt')(({ theme }) => ({
  margin: 0,
  color: theme.colors.text.secondary,
}));

const IdValue = styled('dd')(({ theme }) => ({
  margin: 0,
  color: theme.colors.text.primary,
}));

const EventBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
}));

const Payload = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing * 3,
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  fontSize: 13,
  lineHeight: '18px',
  color: theme.colors.text.primary,
  background: theme.colors.background.secondary,
  borderRadius: theme.radius.innerSurface,
}));

const ChannelLabel = styled('p')(({ theme }) => ({
  margin: 0,
  fontWeight: 700,
  color: theme.colors.text.secondary,
}));

type AnalyticsTrackingGuideProps = {
  showConfiguredIds?: boolean;
};

export const AnalyticsTrackingGuide = ({
  showConfiguredIds = false,
}: AnalyticsTrackingGuideProps) => {
  const { tenant } = useTenant();

  return (
    <Stack>
      <Section>
        <Typography>{__('application.tenantAnalyticsReadonlyIntro')}</Typography>
        <Typography>{__('application.tenantAnalyticsAdvancedMatching')}</Typography>
        {showConfiguredIds ? (
          <Ids>
            <IdLabel>{__('application.tenantAnalyticsGtmId')}</IdLabel>
            <IdValue>{tenant?.gtmId || '—'}</IdValue>
            <IdLabel>{__('application.tenantAnalyticsMetaPixelId')}</IdLabel>
            <IdValue>{tenant?.metaPixelId || '—'}</IdValue>
          </Ids>
        ) : null}
      </Section>
      {events.map((event) => (
        <Section key={event.title}>
          <EventBlock>
            <Header variant="h3">{__(event.title)}</Header>
            <Typography>
              {__('application.tenantAnalyticsWhenLabel')}: {__(event.when)}
            </Typography>
            <ChannelLabel>GTM</ChannelLabel>
            <Payload>{__(event.gtm)}</Payload>
            <ChannelLabel>Meta Pixel</ChannelLabel>
            <Typography>{__(event.matching)}</Typography>
            <Payload>{__(event.meta)}</Payload>
          </EventBlock>
        </Section>
      ))}
    </Stack>
  );
};
