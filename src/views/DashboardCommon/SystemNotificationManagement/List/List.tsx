import React from 'react';
import { systemNotificationListTable, TableSchema } from 'smartbox-tables';

import { ApiTable } from '../../../../components/Common';

import { Section } from '../../../../components/Layout';
import { __ } from '../../../../helpers/i18n';
import { InteractiveTableSchema } from '../../../../utils/table-schema-utils';

import { Header } from 'src/components/ui';

export const List = () => {
  const scheme: TableSchema = new InteractiveTableSchema(
    systemNotificationListTable,
  ).removeFields('id');

  return (
    <Section>
      <Header variant="h2">{__('application.notificationsAboutBoxes')}</Header>
      <ApiTable scheme={scheme} apiEndpointSubUrl={`system-notification`} />
    </Section>
  );
};

