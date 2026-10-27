import React, { useMemo } from 'react';
import { useParams } from 'react-router';

import { FieldType, rentsList } from 'smartbox-tables';
import { AdminRentListDetails, RentStatus } from 'smartbox-types';
import { ApiTable } from 'src/components/Common';
import { Header, Section } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import {
  rentStatusSearchValues,
  translateBoxDisplayStatus,
} from 'src/utils/box-display-status';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import { RentListRowActions } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Rents/List/RentListRowActions';

const List = () => {
  const { stockId } = useParams<{ stockId: string }>();

  const scheme = useMemo(() => {
    const base = new InteractiveTableSchema(rentsList);
    base.highlightRow = (row) => row.status === RentStatus.toCheck;

    return base
      .removeFields('description', 'id', 'userId')
      .modifyFieldStatic('status', {
        searchableValues: rentStatusSearchValues(),
        customValue: (row: {
          status?: Parameters<typeof translateBoxDisplayStatus>[0];
        }) => translateBoxDisplayStatus(row.status),
      })
      .addFieldAtTheEnd({
        name: __('application.actions'),
        field: 'actions',
        type: FieldType.Custom,
        mobile: true,
        customRender: (_value, _field, rentData: AdminRentListDetails) => (
          <RentListRowActions rent={rentData} />
        ),
      });
  }, []);

  return (
    <Section>
      <Header variant="h2">{__('application.stockRents')}</Header>
      <p>{__('application.phrases.rentsReportNote')}</p>

      <ApiTable scheme={scheme} apiEndpointSubUrl={`rent/list/${stockId}`} />
    </Section>
  );
};

export { List };
