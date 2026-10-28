import React from 'react';

import { Header, Stack, Typography } from 'src/components/ui';
import { getApiBaseUrl } from 'src/config/api-url';
import { __ } from 'src/helpers/i18n';
import { ApiEndpointDoc } from 'src/hooks/useApiAccessEndpoints';

import { StyledPre } from './styles';

const getSampleCode = (path: string) => {
  return `fetch('${getApiBaseUrl()}${path}?stockId=STOCK_ID', {
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
})
  .then((response) => response.json())
  .then((data) => console.log(data));`;
};

type EndpointDocsProps = {
  endpoint: ApiEndpointDoc;
};

export const EndpointDocs = ({ endpoint }: EndpointDocsProps) => (
  <Stack>
    <Typography>{__(endpoint.description)}</Typography>
    <Header variant="h3">{__('application.apiAccessSample')}</Header>
    <StyledPre>{getSampleCode(endpoint.path)}</StyledPre>
  </Stack>
);
