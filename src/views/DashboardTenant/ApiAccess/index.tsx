import React, { useState } from 'react';
import { Section, Tabs, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useApiAccessEndpoints } from 'src/hooks/useApiAccessEndpoints';
import { EndpointDocs } from './EndpointDocs';
import { GeneralInfo } from './GeneralInfo';

export const TenantApiAccess = () => {
  const endpoints = useApiAccessEndpoints();
  const [activeSlug, setActiveSlug] = useState(endpoints[0].slug);

  const activeEndpoint =
    endpoints.find((endpoint) => endpoint.slug === activeSlug) ?? endpoints[0];

  return (
    <>
      <GeneralInfo />
      <Section>
        <Tabs
          tabs={endpoints.map((endpoint) => ({
            text: endpoint.tab,
            active: endpoint.slug === activeEndpoint.slug,
            onClick: () => setActiveSlug(endpoint.slug),
          }))}
        />
        <EndpointDocs endpoint={activeEndpoint} />
        <Typography>{__('application.apiAccessStockIdInfo')}</Typography>
      </Section>
    </>
  );
};
