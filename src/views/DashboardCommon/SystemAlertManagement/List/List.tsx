import React, { useMemo } from 'react';

import { FieldType, systemAlertListTable, TableSchema } from 'smartbox-tables';
import { AlertListItem, AlertStatus, UserRole } from 'smartbox-types';
import { ApiTable } from 'src/components/Common';
import { Section } from 'src/components/Layout';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { useMarkAlertReadMutation } from 'src/mutations/useMarkAlertReadMutation';
import { useGetMyDetailsQuery } from 'src/queries';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';

export const List = () => {
  const { data: user } = useGetMyDetailsQuery();
  const { mutate: markRead } = useMarkAlertReadMutation();

  const scheme: TableSchema = useMemo(() => {
    const table = new InteractiveTableSchema(systemAlertListTable);
    if (user?.role === UserRole.admin) {
      table.addFieldAfter('type', {
        name: 'application.tables.customer',
        field: 'tenantId',
        type: FieldType.Text,
        mobile: true,
        sortable: false,
        searchable: false,
      });
    }
    return table.addFieldAtTheEnd({
      name: __('application.actions'),
      field: 'actions',
      mobile: true,
      buttons: [
        {
          name: 'application.markAlertRead',
          type: 'secondary',
          click: (data: AlertListItem) => {
            if (data.status !== AlertStatus.Open) return;
            markRead(data.id);
          },
        },
      ],
    });
  }, [markRead, user?.role]);

  return (
    <Section>
      <Header variant="h2">{__('application.systemAlerts')}</Header>
      <ApiTable scheme={scheme} apiEndpointSubUrl="system-alert/list" />
    </Section>
  );
};
