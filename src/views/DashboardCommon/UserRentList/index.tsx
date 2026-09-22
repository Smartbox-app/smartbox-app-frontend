import React, { useMemo } from 'react';
import { AdminRentListDetails, RentStatus } from 'smartbox-types';
import { FieldType, rentsList } from 'smartbox-tables';
import { ApiTable } from 'src/components/Common';
import { __ } from 'src/helpers/i18n';
import { InteractiveTableSchema } from 'src/utils/table-schema-utils';
import {
  rentStatusSearchValues,
  translateBoxDisplayStatus,
} from 'src/utils/box-display-status';
import { SectionHeader } from 'src/components/Layout';
import { USER_RENTS_LIST } from 'src/constants/api-table-instances';
import { RentListRowActions } from 'src/views/DashboardCommon/StockGroups/Stocks/Manage/Rents/List/RentListRowActions';

interface Props {
  userId: string;
}

const UserRentList = ({ userId }: Props) => {
  const scheme = useMemo(() => {
    const base = new InteractiveTableSchema(rentsList);
    base.highlightRow = (row) => row.status === RentStatus.toCheck;

    return base
      .removeFields(
        'description',
        'id',
        'userId',
        'firstName',
        'lastName',
        'email',
      )
      .modifyFieldStatic('status', {
        searchableValues: rentStatusSearchValues(),
        customValue: (row) => translateBoxDisplayStatus(row.status),
      })
      .addFieldAfter('number', {
        name: __('application.stock'),
        field: 'stockName',
        mobile: true,
        searchable: false,
        sortable: false,
        defaultSort: false,
        type: FieldType.Text,
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
    <>
      <SectionHeader title="application.history" />
      <ApiTable
        scheme={scheme}
        instanceId={USER_RENTS_LIST}
        apiEndpointSubUrl={`rent/list-user/${userId}`}
      />
    </>
  );
};

export default UserRentList;
