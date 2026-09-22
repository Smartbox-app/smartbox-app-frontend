import React from 'react';
import { Header, Link, Section, Typography } from 'src/components/ui';
import { getApiBaseUrl } from 'src/config/api-url';
import { __ } from 'src/helpers/i18n';
import { StyledPre } from './styles';

export const GeneralInfo = () => {
  const apiUrl = getApiBaseUrl();
  const docsUrl = `${apiUrl}public-docs`;

  return (
    <Section>
      <Header variant="h2">{__('application.apiAccess')}</Header>
      <Typography>{__('application.apiAccessKeyFromAdmin')}</Typography>

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
