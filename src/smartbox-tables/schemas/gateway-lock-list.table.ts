import { FieldType, TableSchema } from 'src/smartbox-tables/typings';

export const gatewayLocksList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'application.tables.id',
      field: 'lockId',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.name',
      field: 'lockName',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.alias',
      field: 'lockAlias',
      mobile: true,
      searchable: true,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'application.tables.gatewaySignal',
      field: 'rssi',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
    },
    {
      name: 'application.tables.battery',
      field: 'electricQuantity',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
    },
  ],
};
