import { FieldType, TableSchema } from '../typings';

export const gatewayLocksList: TableSchema = {
  countPerPage: 20,
  fields: [
    {
      name: 'ID',
      field: 'lockId',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Nazwa',
      field: 'lockName',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Alias',
      field: 'lockAlias',
      mobile: true,
      searchable: true,
      sortable: false,
      defaultSort: false,
      type: FieldType.Text,
    },
    {
      name: 'Sygnał bramki',
      field: 'rssi',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
    },
    {
      name: 'Stan baterii',
      field: 'electricQuantity',
      mobile: true,
      searchable: false,
      sortable: false,
      defaultSort: false,
      type: FieldType.Custom,
    },
  ],
};
