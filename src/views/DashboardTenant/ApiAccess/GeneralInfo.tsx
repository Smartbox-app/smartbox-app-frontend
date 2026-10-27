import React from 'react';

import { Header, Link, Section, Typography } from 'src/components/ui';
import { getApiBaseUrl } from 'src/config/api-url';
import { __ } from 'src/helpers/i18n';
import { StyledPre } from 'src/views/DashboardTenant/ApiAccess/styles';

export type GeneralInfoProps = {
  forAdmin?: boolean;
};

export const GeneralInfo = ({ forAdmin = false }: GeneralInfoProps) => {
  const apiUrl = getApiBaseUrl();
  const docsUrl = `${apiUrl}public-docs`;

  return (
    <Section>
      <Header variant="h2">{__('application.apiAccess')}</Header>
      {!forAdmin ? (
        <Typography>{__('application.apiAccessKeyFromAdmin')}</Typography>
      ) : null}

      <div>
        <Header variant="h3">{__('application.apiAccessUrl')}</Header>
        <StyledPre>{apiUrl}</StyledPre>
      </div>
      <Typography>
        {__('application.apiAccessDocsDescription')}{' '}
        <strong>
          <Link href={docsUrl} target="_blank" rel="noreferrer">
            {__('application.apiAccessDocsLink')}
          </Link>
        </strong>
      </Typography>
    </Section>
  );
};
