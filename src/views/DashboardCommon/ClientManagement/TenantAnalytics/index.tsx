import React from 'react';
import styled from 'styled-components';

import { __ } from 'src/helpers/i18n';

import { ManageTenantSettingsForm } from '../TenantSettingsForm';

interface Props {
  userId?: string;
}

const Description = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  marginBottom: theme.spacing * 4,
  fontSize: 14,
  lineHeight: '20px',
  color: theme.colors.text.primary,
}));

const EventsList = styled('ul')(({ theme }) => ({
  margin: 0,
  paddingLeft: theme.spacing * 5,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing * 2,
  listStyleType: 'disc',
}));

const AnalyticsEventsDescription = () => (
  <Description>
    <p>{__('application.tenantAnalyticsDescription')}</p>
    <EventsList>
      <li>{__('application.tenantAnalyticsEventSignUp')}</li>
      <li>{__('application.tenantAnalyticsEventBeginCheckout')}</li>
      <li>{__('application.tenantAnalyticsEventPurchase')}</li>
    </EventsList>
  </Description>
);

const ManageTenantAnalytics = ({ userId }: Props) => (
  <ManageTenantSettingsForm
    userId={userId}
    formId="tenantAnalyticsForm"
    adminFetchUrl={(id) => `tenant/form/admin-analytics/${id}`}
    adminSendUrl={(id) => `tenant/admin/analytics/${id}`}
    header={<AnalyticsEventsDescription />}
  />
);

export { ManageTenantAnalytics };
