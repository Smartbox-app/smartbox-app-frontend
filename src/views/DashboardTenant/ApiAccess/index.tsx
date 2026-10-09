import React, { useState } from 'react';
import { Header, Section, Tabs, Typography } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useApiAccessEndpoints } from 'src/hooks/useApiAccessEndpoints';
import { useGetStockOptionsQuery } from 'src/queries';
import { EndpointDocs } from './EndpointDocs';
import { GeneralInfo } from './GeneralInfo';

export type TenantApiAccessProps = {
  forAdmin?: boolean;
};

export const TenantApiAccess = ({ forAdmin = false }: TenantApiAccessProps) => {
  const endpoints = useApiAccessEndpoints();
  const [activeSlug, setActiveSlug] = useState(endpoints[0].slug);
  const { data: stocks } = useGetStockOptionsQuery(undefined, !forAdmin);

  const activeEndpoint =
    endpoints.find((endpoint) => endpoint.slug === activeSlug) ?? endpoints[0];

  return (
    <>
      <GeneralInfo forAdmin={forAdmin} />
      <Section>
        <Tabs
          tabs={endpoints.map((endpoint) => ({
            text: endpoint.tab,
            active: endpoint.slug === activeEndpoint.slug,
            onClick: () => setActiveSlug(endpoint.slug),
          }))}
        />
        <EndpointDocs endpoint={activeEndpoint} />
        {forAdmin ? (
          <Typography>{__('application.apiAccessStockIdAdminInfo')}</Typography>
        ) : (
          <>
            <Typography>{__('application.apiAccessStockIdInfo')}</Typography>
            <Typography>{__('application.apiAccessStockIdHint')}</Typography>
            <Header variant="h3">{__('application.apiAccessStockIdList')}</Header>
            {stocks?.map((stock) => (
              <Typography key={stock.value}>
                {stock.label} — {stock.value}
              </Typography>
            ))}
          </>
        )}
      </Section>
    </>
  );
};
