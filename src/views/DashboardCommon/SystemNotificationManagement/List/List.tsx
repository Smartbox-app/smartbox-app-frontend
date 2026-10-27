import React from 'react';

import { systemNotificationListTable, TableSchema } from 'smartbox-tables';
import { ApiTable } from 'src/components/Common';
import { Section } from 'src/components/Layout';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const List = () => {
  const scheme: TableSchema = new InteractiveTableSchema(
    systemNotificationListTable,
  ).removeFields('id');

  return (
    <Section>
      <Header variant="h2">{__('application.notificationsAboutBoxes')}</Header>
      <ApiTable scheme={scheme} apiEndpointSubUrl="system-notification" />
    </Section>
  );
};

